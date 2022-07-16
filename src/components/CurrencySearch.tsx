// eslint-disable-next-line no-restricted-imports
import { Currency, Token } from '@uniswap/sdk-core'
import useActiveWeb3React from '@/src/hooks/useActiveWeb3React'
import useDebounce from '@/src/hooks/useDebounce'
import { useOnClickOutside } from '@/src/hooks/useOnClickOutside'
import useToggle from '@/src/hooks/useToggle'
import useNativeCurrency, { useToken, useIsUserAddedToken } from '@/src/hooks/useCurrency'
import { getTokenFilter } from '@/src/hooks/useTokenList'
import { tokenComparator, useSortTokensByQuery } from '@/src/hooks/useTokenList'
import { KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Edit, X } from 'react-feather'
import { FixedSizeList } from 'react-window'
import { useAllTokenBalances } from '@/src/state/wallet/hooks'
import styled from 'styled-components'

import { useAllTokens, useSearchInactiveTokenLists, } from '@/src/hooks/useTokenList'
import { isAddress } from '@/src/utils'
import CommonBases from '@/src/components/CommonBases'
import CurrencyList from './CurrencyList'
import ImportRow from './ImportRow'

import AutoSizer from 'react-virtualized-auto-sizer'

const ContentWrapper = styled.div`
  width: 100%;
  flex: 1 1;
  position: relative;
`

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  border-radius: 20px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`

interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  showCurrencyAmount?: boolean
  disableNonToken?: boolean
  showManageView: () => void
  showImportView: () => void
  setImportToken: (token: Token) => void
}

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  showCurrencyAmount,
  disableNonToken,
  onDismiss,
  isOpen,
  showManageView,
  showImportView,
  setImportToken,
}: CurrencySearchProps) {
  const { account, chainId } = useActiveWeb3React()


  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  const allTokens = useAllTokens()
  // console.log(allTokens)

  // if they input an address, use it
  const isAddressSearch = isAddress(debouncedQuery)

  const searchToken = useToken(debouncedQuery)

  const searchTokenIsAdded = useIsUserAddedToken(searchToken)

  const filteredTokens: Token[] = useMemo(() => {
    return Object.values(allTokens).filter(getTokenFilter(debouncedQuery))
  }, [allTokens, debouncedQuery])

  const balances = useAllTokenBalances()
  const sortedTokens: Token[] = useMemo(() => {
    return filteredTokens.sort(tokenComparator.bind(null, balances))
  }, [balances, filteredTokens])

  const filteredSortedTokens = useSortTokensByQuery(debouncedQuery, sortedTokens)

  const native = useNativeCurrency()

  const filteredSortedTokensWithETH: Currency[] = useMemo(() => {
    if (!native) return filteredSortedTokens

    const s = debouncedQuery.toLowerCase().trim()
    if (native.symbol?.toLowerCase()?.indexOf(s) !== -1) {
      return native ? [native, ...filteredSortedTokens] : filteredSortedTokens
    }
    return filteredSortedTokens
  }, [debouncedQuery, native, filteredSortedTokens])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback((event:any) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toLowerCase().trim()
        if (s === native?.symbol?.toLowerCase()) {
          handleCurrencySelect(native)
        } else if (filteredSortedTokensWithETH.length > 0) {
          if (
            filteredSortedTokensWithETH[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokensWithETH.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokensWithETH[0])
          }
        }
      }
    },
    [debouncedQuery, native, filteredSortedTokensWithETH, handleCurrencySelect]
  )

  // menu ui
  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  useOnClickOutside(node, open ? toggle : undefined)


  // if no results on main list, show option to expand into inactive
  const filteredInactiveTokens = useSearchInactiveTokenLists(
    filteredTokens.length === 0 || (debouncedQuery.length > 2 && !isAddressSearch) ? debouncedQuery : undefined
  )

  return (
    <ContentWrapper>
      <div className="flex flex-col">
        <div className="flex justify-between py-4 px-6">
          <span className="text-lg">
            Select a token
          </span>
          <X onClick={onDismiss} className="cursor-pointer" />
        </div>
        <div className="flex w-full mb-1">
          <input
            className="px-4 py-2 text-lg w-full mx-3 rounded-2xl dark:outline-0 dark:bg-[#413636]"
            type="text"
            id="token-search-input"
            placeholder={`Search name or paste address`}
            autoComplete="off"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            onKeyDown={handleEnter}
          />
        </div>
        {showCommonBases && chainId && (
          <CommonBases chainId={chainId} onSelect={handleCurrencySelect} selectedCurrency={selectedCurrency} otherCurrency={otherSelectedCurrency} />
        )}
      </div>
      <br />
      {searchToken && !searchTokenIsAdded ? (
        <div style={{ padding: '20px 0', height: '100%' }}>
          <ImportRow token={searchToken} showImportView={showImportView} setImportToken={setImportToken} />
        </div>
      ) : filteredSortedTokens?.length > 0 || filteredInactiveTokens?.length > 0 ? (
        <div className="flex-1 w-full" style={{height: 'calc(80vh - 288px)'}}>
          <AutoSizer disableWidth>
            {({ height }) => (
              <CurrencyList
                height={height}
                currencies={disableNonToken ? filteredSortedTokens : filteredSortedTokensWithETH}
                otherListTokens={filteredInactiveTokens}
                onCurrencySelect={handleCurrencySelect}
                otherCurrency={otherSelectedCurrency}
                selectedCurrency={selectedCurrency}
                fixedListRef={fixedList}
                showImportView={showImportView}
                setImportToken={setImportToken}
                showCurrencyAmount={showCurrencyAmount}
              />
            )}
          </AutoSizer>
        </div>
      ) : (
        <div className="p-5 h-full">
          <div className="mb-5">
            No results found.
          </div>
        </div>
      )}
      <Footer onClick={showManageView} className="cursor-pointer dark:border-t-2 p-4 hover:dark:bg-[#2f2929]">
        <div className="w-full flex justify-center ">
          <div className="mr-4">
            <Edit />
          </div>
          <div className="text-xl">
            Manage Token Lists
          </div>
        </div>
      </Footer>
    </ContentWrapper>
  )
}
