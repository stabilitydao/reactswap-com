import { Currency, CurrencyAmount, NativeCurrency, Token } from '@uniswap/sdk-core'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'
import { TokenInfo, TokenList } from '@uniswap/token-lists'
import { WrappedTokenInfo } from '@/src/state/lists/wrappedTokenInfo'
import { useSelector } from 'react-redux'
import { selectChainId } from '@/src/state/network'
import uriToHttp from '@/src/utils/uriToHttp'
import getTokenList from '@/src/utils/getTokenList'
import { isAddress } from '@/src/utils'
import type { Ajv, ValidateFunction } from 'ajv'
import { TokenAddressMap, useAllLists, useCombinedActiveList, useInactiveListUrls } from '@/src/state/lists/hooks'
import useActiveWeb3React from '@/src/hooks/useActiveWeb3React'
import { useUserAddedTokens } from '@/src/state/user/hooks'
import { UNSUPPORTED_TOKENS } from '@/src/constants/currencies'

export const DEFAULT_TOKEN_LIST = 'https://gateway.ipfs.io/ipns/tokens.uniswap.org'

export type ChainTokenMap = Readonly<{ [chainId: number]: Readonly<{ [tokenAddress: string]: { token: WrappedTokenInfo; list?: TokenList } }> }>

const MISSING_PROVIDER = Symbol()
const ChainTokenMapContext = createContext<ChainTokenMap | undefined | typeof MISSING_PROVIDER>(MISSING_PROVIDER)

function useChainTokenMapContext() {
  const chainTokenMap = useContext(ChainTokenMapContext)
  if (chainTokenMap === MISSING_PROVIDER) {
    throw new Error('TokenList hooks must be wrapped in a <TokenListProvider>')
  }
  return chainTokenMap
}


export type TokenMap = { [address: string]: Token }
// type TokenMap = Readonly<{ [tokenAddress: string]: { token: WrappedTokenInfo; list?: TokenList } }>

export function useTokenMap(): TokenMap {
  const chainId = useSelector(selectChainId)
  const chainTokenMap = useChainTokenMapContext()
  const tokenMap = chainId && chainTokenMap?.[chainId]
  return useMemo(() => {
    if (!tokenMap) return {}
    // console.log('Object.entries(tokenMap)', Object.entries(tokenMap))
    return Object.entries(tokenMap).reduce((map, [address, { token }]) => {
      map[address] = token
      return map
    }, {} as TokenMap)
  }, [tokenMap])
}


export function TokenListProvider({
                                    list = DEFAULT_TOKEN_LIST,
                                    children,
                                  }: PropsWithChildren<{ list?: string | TokenInfo[] }>) {
  // Error boundaries will not catch (non-rendering) async errors, but it should still be shown
  const [error, setError] = useState<Error>()
  if (error) throw error

  const [chainTokenMap, setChainTokenMap] = useState<ChainTokenMap>()

  useEffect(() => setChainTokenMap(undefined), [list])

  // const { chainId, library } = useActiveWeb3React()
  /*const resolver = useCallback(
    (ensName: string) => {
      if (library && chainId === 1) {
        return resolveENSContentHash(ensName, library)
      }
      throw new Error('Could not construct mainnet ENS resolver')
    },
    [chainId, library]
  )*/

  useEffect(() => {
    // If the list was already loaded, don't reload it.
    if (chainTokenMap) return

    let stale = false
    activateList(list)
    return () => {
      stale = true
    }

    async function activateList(list: string | TokenInfo[]) {
      try {
        let tokens: TokenList | TokenInfo[]
        if (typeof list === 'string') {
          tokens = await getTokenList(list)
        } else {
          tokens = await validateTokens(list)
        }
        // tokensToChainTokenMap also caches the fetched tokens, so it must be invoked even if stale.
        const map = tokensToChainTokenMap(tokens)
        if (!stale) {
          setChainTokenMap(map)
          setError(undefined)
        }
      } catch (e: unknown) {
        if (!stale) {
          // Do not update the token map, in case the map was already resolved without error on mainnet.
          setError(e as Error)
        }
      }
    }
  }, [chainTokenMap, list/*, resolver*/])

  return <ChainTokenMapContext.Provider value={chainTokenMap}>{children}</ChainTokenMapContext.Provider>
}

const listCache = new Map<string, TokenList>()

/** Fetches and validates a token list. */
export default async function fetchTokenList(
  listUrl: string
): Promise<TokenList> {
  const cached = listCache?.get(listUrl) // avoid spurious re-fetches
  if (cached) {
    return cached
  }

  let urls: string[]
  urls = uriToHttp(listUrl)

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const isLast = i === urls.length - 1
    let response
    try {
      response = await fetch(url, { credentials: 'omit' })
    } catch (error) {
      const message = `failed to fetch list: ${listUrl}`
      console.debug(message, error)
      if (isLast) throw new Error(message)
      continue
    }

    if (!response.ok) {
      const message = `failed to fetch list: ${listUrl}`
      console.debug(message, response.statusText)
      if (isLast) throw new Error(message)
      continue
    }

    const json = await response.json()
    const list = await validateTokenList(json)
    listCache?.set(listUrl, list)
    return list
  }

  throw new Error('Unrecognized list URL protocol.')
}

type Mutable<T> = {
  -readonly [P in keyof T]: Mutable<T[P]>
}

const mapCache = typeof WeakMap !== 'undefined' ? new WeakMap<TokenList | TokenInfo[], ChainTokenMap>() : null

export function tokensToChainTokenMap(tokens: TokenList | TokenInfo[]): ChainTokenMap {
  const cached = mapCache?.get(tokens)
  if (cached) return cached

  const [list, infos] = Array.isArray(tokens) ? [undefined, tokens] : [tokens, tokens.tokens]
  const map = infos.reduce<Mutable<ChainTokenMap>>((map, info) => {
    const token = new WrappedTokenInfo(info, list)
    if (map[token.chainId]?.[token.address] !== undefined) {
      console.warn(`Duplicate token skipped: ${token.address}`)
      return map
    }
    if (!map[token.chainId]) {
      map[token.chainId] = {}
    }
    map[token.chainId][token.address] = { token, list }
    return map
  }, {}) as ChainTokenMap
  mapCache?.set(tokens, map)
  return map
}


enum ValidationSchema {
  LIST = 'list',
  TOKENS = 'tokens',
}

const validator = new Promise<Ajv>(async (resolve) => {
  const [ajv, schema] = await Promise.all([import('ajv'), import('@uniswap/token-lists/src/tokenlist.schema.json')])
  const validator = new ajv.default({ allErrors: true })
    .addSchema(schema, ValidationSchema.LIST)
    // Adds a meta scheme of Pick<TokenList, 'tokens'>
    .addSchema(
      {
        ...schema,
        $id: schema.$id + '#tokens',
        required: ['tokens'],
      },
      ValidationSchema.TOKENS
    )
  resolve(validator)
})

function getValidationErrors(validate: ValidateFunction | undefined): string {
  return (
    validate?.errors?.map((error) => [error.dataPath, error.message].filter(Boolean).join(' ')).join('; ') ??
    'unknown error'
  )
}

/**
 * Validates an array of tokens.
 * @param json the TokenInfo[] to validate
 */
export async function validateTokens(json: TokenInfo[]): Promise<TokenInfo[]> {
  const validate = (await validator).getSchema(ValidationSchema.TOKENS)
  if (validate?.({ tokens: json })) {
    return json
  }
  throw new Error(`Token list failed validation: ${getValidationErrors(validate)}`)
}

// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(tokenMap: TokenAddressMap, includeUserAdded: boolean): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React()
  const userAddedTokens = useUserAddedTokens()

  return useMemo(() => {
    if (!chainId) return {}

    // reduce to just tokens
    const mapWithoutUrls = Object.keys(tokenMap[chainId] ?? {}).reduce<{ [address: string]: Token }>(
      (newMap, address) => {
        if (!UNSUPPORTED_TOKENS[chainId].includes(address)) {
          newMap[address] = tokenMap[chainId][address].token
        }
        return newMap
      },
      {}
    )

    if (includeUserAdded) {
      return (
        userAddedTokens
          // reduce into all ALL_TOKENS filtered by the current chain
          .reduce<{ [address: string]: Token }>(
            (tokenMap, token) => {
              tokenMap[token.address] = token
              return tokenMap
            },
            // must make a copy because reduce modifies the map, and we do not
            // want to make a copy in every iteration
            { ...mapWithoutUrls }
          )
      )
    }

    return mapWithoutUrls
  }, [chainId, userAddedTokens, tokenMap, includeUserAdded])
}

/**
 * Validates a token list.
 * @param json the TokenList to validate
 */
export async function validateTokenList(json: TokenList): Promise<TokenList> {
  const validate = (await validator).getSchema(ValidationSchema.LIST)
  if (validate?.(json)) {
    return json
  }
  throw new Error(`Token list failed validation: ${getValidationErrors(validate)}`)
}

export function useAllTokens(): { [address: string]: Token } {
  const allTokens = useCombinedActiveList()
  // console.log('useAllTokensMap', allTokens)
  return useTokensFromMap(allTokens, true)
}

const alwaysTrue = () => true

/** Creates a filter function that filters tokens that do not match the query. */
export function getTokenFilter<T extends Token | TokenInfo>(query: string): (token: T | NativeCurrency) => boolean {
  const searchingAddress = isAddress(query)

  if (searchingAddress) {
    const address = searchingAddress.toLowerCase()
    return (t: T | NativeCurrency) => 'address' in t && address === t.address.toLowerCase()
  }

  const queryParts = query
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0)

  if (queryParts.length === 0) return alwaysTrue

  const match = (s: string): boolean => {
    const parts = s
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)

    return queryParts.every((p) => p.length === 0 || parts.some((sp) => sp.startsWith(p) || sp.endsWith(p)))
  }

  return ({ name, symbol }: T | NativeCurrency): boolean => Boolean((symbol && match(symbol)) || (name && match(name)))
}

/** Sorts currency amounts (descending). */
function balanceComparator(a?: CurrencyAmount<Currency>, b?: CurrencyAmount<Currency>) {
  if (a && b) {
    return a.greaterThan(b) ? -1 : a.equalTo(b) ? 0 : 1
  } else if (a?.greaterThan('0')) {
    return -1
  } else if (b?.greaterThan('0')) {
    return 1
  }
  return 0
}

type TokenBalances = { [tokenAddress: string]: CurrencyAmount<Token> | undefined }

/** Sorts tokens by currency amount (descending), then symbol (ascending). */
export function tokenComparator(balances: TokenBalances, a: Token, b: Token) {
  // Sorts by balances
  const balanceComparison = balanceComparator(balances[a.address], balances[b.address])
  if (balanceComparison !== 0) return balanceComparison

  // Sorts by symbol
  if (a.symbol && b.symbol) {
    return a.symbol.toLowerCase() < b.symbol.toLowerCase() ? -1 : 1
  }

  return -1
}

/** Sorts tokens by query, giving precedence to exact matches and partial matches. */
export function useSortTokensByQuery<T extends Token | TokenInfo>(query: string, tokens?: T[]): T[] {
  return useMemo(() => {
    if (!tokens) {
      return []
    }

    const matches = query
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)

    if (matches.length > 1) {
      return tokens
    }

    const exactMatches: T[] = []
    const symbolSubtrings: T[] = []
    const rest: T[] = []

    // sort tokens by exact match -> subtring on symbol match -> rest
    tokens.map((token) => {
      if (token.symbol?.toLowerCase() === matches[0]) {
        return exactMatches.push(token)
      } else if (token.symbol?.toLowerCase().startsWith(query.toLowerCase().trim())) {
        return symbolSubtrings.push(token)
      } else {
        return rest.push(token)
      }
    })

    return [...exactMatches, ...symbolSubtrings, ...rest]
  }, [tokens, query])
}

export function useSearchInactiveTokenLists(search: string | undefined, minResults = 10): WrappedTokenInfo[] {
  const lists = useAllLists()
  const inactiveUrls = useInactiveListUrls()
  const { account, chainId } = useActiveWeb3React()
  const activeTokens = useAllTokens()
  return useMemo(() => {
    if (!search || search.trim().length === 0) return []
    const tokenFilter = getTokenFilter(search)
    const result: WrappedTokenInfo[] = []
    const addressSet: { [address: string]: true } = {}
    for (const url of inactiveUrls) {
      const list = lists[url].current
      if (!list) continue
      for (const tokenInfo of list.tokens) {
        if (tokenInfo.chainId === chainId && tokenFilter(tokenInfo)) {
          const wrapped: WrappedTokenInfo = new WrappedTokenInfo(tokenInfo, list)
          if (!(wrapped.address in activeTokens) && !addressSet[wrapped.address]) {
            addressSet[wrapped.address] = true
            result.push(wrapped)
            if (result.length >= minResults) return result
          }
        }
      }
    }
    return result
  }, [activeTokens, chainId, inactiveUrls, lists, minResults, search, account])
}