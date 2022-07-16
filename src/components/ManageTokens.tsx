import { Token } from '@uniswap/sdk-core'
import CurrencyLogo from './CurrencyLogo'
import { useToken } from '@/src/hooks/useCurrency'
import useActiveWeb3React from '@/src/hooks/useActiveWeb3React'
import { RefObject, useCallback, useMemo, useRef, useState } from 'react'
import { useRemoveUserAddedToken, useUserAddedTokens } from '@/src/state/user/hooks'
import styled from 'styled-components'
import { isAddress } from '@/src/utils'

import { ExplorerDataType, getExplorerLink } from '@/src/utils/getExplorerLink'
import { CurrencyModalView } from './CurrencySearchModal'
import ImportRow from './ImportRow'
import { BiFastForward, BiTrash } from 'react-icons/bi'

const Wrapper = styled.div`
  width: 100%;
  height: calc(100% - 60px);
  position: relative;
  padding-bottom: 80px;
`

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  border-radius: 20px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  border-top: 1px solid ${({ theme }) => theme.bg3};
  padding: 20px;
  text-align: center;
`

export default function ManageTokens({
  setModalView,
  setImportToken,
}: {
  setModalView: (view: CurrencyModalView) => void
  setImportToken: (token: Token) => void
}) {
  const { chainId } = useActiveWeb3React()

  const [searchQuery, setSearchQuery] = useState<string>('')

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback((event:any) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
  }, [])

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery)
  const searchToken = useToken(searchQuery)

  // all tokens for local lisr
  const userAddedTokens: Token[] = useUserAddedTokens()
  const removeToken = useRemoveUserAddedToken()

  const handleRemoveAll = useCallback(() => {
    if (chainId && userAddedTokens) {
      userAddedTokens.map((token) => {
        return removeToken(chainId, token.address)
      })
    }
  }, [removeToken, userAddedTokens, chainId])

  const tokenList = useMemo(() => {
    return (
      chainId &&
      userAddedTokens.map((token) => (
        <div className="w-full flex justify-between" key={token.address}>
          <div className="flex items-center">
            <CurrencyLogo currency={token} size={'10'} />
            <a href={getExplorerLink(chainId, token.address, ExplorerDataType.ADDRESS)} target="_blank" rel="noreferrer" >
              <div className="font-bold ml-2">
                {token.symbol}
              </div>
            </a>
          </div>
          <div className="flex items-center text-xl">
            <BiTrash title="Remove" className="cursor-pointer" onClick={() => removeToken(chainId, token.address)} />
            <a className="ml-3" title="Go to explorer" href={getExplorerLink(chainId, token.address, ExplorerDataType.ADDRESS)}  target="_blank" rel="noreferrer" >
              <BiFastForward />
            </a>
          </div>
        </div>
      ))
    )
  }, [userAddedTokens, chainId, removeToken])

  return (
    <Wrapper>
      <div className="w-full h-full flex flex-col px-4">
        <div className="flex flex-col gap-2">
          <div className="flex">
            <input
              className="w-full px-3 py-1.5 rounded-2xl text-xl"
              type="text"
              id="token-search-input"
              placeholder={'0x0000'}
              value={searchQuery}
              autoComplete="off"
              ref={inputRef as RefObject<HTMLInputElement>}
              onChange={handleInput}
            />
          </div>
          {searchQuery !== '' && !isAddressSearch && (
            <div className="text-red-300">
              <span>Enter valid token address</span>
            </div>
          )}
          {searchToken && (
            <div className="bg-indigo-600 py-4">
              <ImportRow
                token={searchToken}
                showImportView={() => setModalView(CurrencyModalView.importToken)}
                setImportToken={setImportToken}
                style={{ height: 'fit-content' }}
              />
            </div>
          )}
        </div>
        <br />
        <div className="flex gap-2 flex-col overflow-auto mb-4">
          <div className="flex justify-between">
            <div>
              <span>{userAddedTokens?.length} Custom Tokens</span>
            </div>
            {userAddedTokens.length > 0 && (
              <button className="cursor-pointer" onClick={handleRemoveAll}>
                <div>
                  <span>Clear all</span>
                </div>
              </button>
            )}
          </div>
          {tokenList}
        </div>
      </div>
      <Footer>
        <div>
          <span>Tip: Custom tokens are stored locally in your browser</span>
        </div>
      </Footer>
    </Wrapper>
  )
}
