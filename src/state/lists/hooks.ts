import { useMemo } from 'react'
import { AppState } from '../store'
import { DEFAULT_LIST_OF_LISTS, UNSUPPORTED_LIST_URLS } from '@/src/constants/lists'
import { ChainId } from '@/src/enums/ChainId'
import { WrappedTokenInfo } from '@/src/state/lists/wrappedTokenInfo'
import { TokenList } from '@uniswap/token-lists'
import { useSelector } from 'react-redux'
// import BROKEN_LIST from '../../constants/tokenLists/broken.tokenlist.json'
// import UNSUPPORTED_TOKEN_LIST from '../../constants/tokenLists/unsupported.tokenlist.json'

export type TokenAddressMap = Readonly<{
  [chainId: number]: Readonly<{ [tokenAddress: string]: { token: WrappedTokenInfo; list: TokenList } }>
}>

type Mutable<T> = {
  -readonly [P in keyof T]: Mutable<T[P]>
}

const DEFAULT_LIST_PRIORITIES = DEFAULT_LIST_OF_LISTS.reduce<{ [listUrl: string]: number }>((memo, listUrl, index) => {
  memo[listUrl] = index + 1
  return memo
}, {})

// use ordering of default list of lists to assign priority
function sortByListPriority(urlA: string, urlB: string) {
  if (DEFAULT_LIST_PRIORITIES[urlA] && DEFAULT_LIST_PRIORITIES[urlB]) {
    return DEFAULT_LIST_PRIORITIES[urlA] - DEFAULT_LIST_PRIORITIES[urlB]
  }
  return 0
}

export function useAllLists(): AppState['lists']['byUrl'] {
  return useSelector<AppState, AppState['lists']['byUrl']>((state) => state.lists.byUrl)
}

/**
 * Combine the tokens in map2 with the tokens on map1, where tokens on map1 take precedence
 * @param map1 the base token map
 * @param map2 the map of additioanl tokens to add to the base map
 */
export function combineMaps(map1: TokenAddressMap, map2: TokenAddressMap): TokenAddressMap {
  return {
    [ChainId.POLYGON]: { ...map1[ChainId.POLYGON], ...map2[ChainId.POLYGON] },
    [ChainId.MUMBAI]: { ...map1[ChainId.MUMBAI], ...map2[ChainId.MUMBAI] },
  }
}

// merge tokens contained within lists from urls
function useCombinedTokenMapFromUrls(urls: string[] | undefined): TokenAddressMap {
  const lists = useAllLists()
  // console.log('useCombinedTokenMapFromUrls urls:', urls)
  // console.log('useCombinedTokenMapFromUrls lists:', lists)
  return useMemo(() => {
    if (!urls) return {}
    return (
      urls
        .slice()
        // sort by priority so top priority goes last
        .sort(sortByListPriority)
        .reduce((allTokens, currentUrl) => {
          const current = lists[currentUrl]?.current
          if (!current) return allTokens
          try {
            return combineMaps(allTokens, listToTokenMap(current))
          } catch (error) {
            console.error('Could not show token list due to error', error)
            return allTokens
          }
        }, {})
    )
  }, [lists, urls])
}

const listCache: WeakMap<TokenList, TokenAddressMap> | null =
  typeof WeakMap !== 'undefined' ? new WeakMap<TokenList, TokenAddressMap>() : null

function listToTokenMap(list: TokenList): TokenAddressMap {
  const result = listCache?.get(list)
  if (result) return result

  const map = list.tokens.reduce<TokenAddressMap>((tokenMap, tokenInfo) => {
    const token = new WrappedTokenInfo(tokenInfo, list)
    if (tokenMap[token.chainId]?.[token.address] !== undefined) {
      console.error(new Error(`Duplicate token! ${token.address}`))
      return tokenMap
    }
    return {
      ...tokenMap,
      [token.chainId]: {
        ...tokenMap[token.chainId],
        [token.address]: {
          token,
          list,
        },
      },
    }
  }, {})
  listCache?.set(list, map)
  return map
}

// filter out unsupported lists
export function useActiveListUrls(): string[] | undefined {
  const activeListUrls = useSelector<AppState, AppState['lists']['activeListUrls']>((state) => state.lists.activeListUrls)
  return useMemo(() => activeListUrls?.filter((url) => !UNSUPPORTED_LIST_URLS.includes(url)), [activeListUrls])
}

export function useInactiveListUrls(): string[] {
  const lists = useAllLists()
  const allActiveListUrls = useActiveListUrls()
  return useMemo(
    () => Object.keys(lists).filter((url) => !allActiveListUrls?.includes(url) && !UNSUPPORTED_LIST_URLS.includes(url)),
    [lists, allActiveListUrls]
  )
}

// get all the tokens from active lists, combine with local default tokens
export function useCombinedActiveList(): TokenAddressMap {
  const activeListUrls = useActiveListUrls()
  return useCombinedTokenMapFromUrls(activeListUrls)
}

// list of tokens not supported on interface for various reasons, used to show warnings and prevent swaps and adds
/*export function useUnsupportedTokenList(): TokenAddressMap {
  // get hard-coded broken tokens
  const brokenListMap = useMemo(() => tokensToChainTokenMap(BROKEN_LIST), [])

  // get hard-coded list of unsupported tokens
  const localUnsupportedListMap = useMemo(() => tokensToChainTokenMap(UNSUPPORTED_TOKEN_LIST), [])

  // get dynamic list of unsupported tokens
  const loadedUnsupportedListMap = useCombinedTokenMapFromUrls(UNSUPPORTED_LIST_URLS)

  // format into one token address map
  return useMemo(
    () => combineMaps(brokenListMap, combineMaps(localUnsupportedListMap, loadedUnsupportedListMap)),
    [brokenListMap, localUnsupportedListMap, loadedUnsupportedListMap]
  )
}*/
export function useIsListActive(url: string): boolean {
  const activeListUrls = useActiveListUrls()
  return Boolean(activeListUrls?.includes(url))
}
