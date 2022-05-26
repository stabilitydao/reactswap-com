import { Token } from '@uniswap/sdk-core'
import { TokenList } from '@uniswap/token-lists'
import { useState } from 'react'
import { ArrowLeft, X } from 'react-feather'
import styled from 'styled-components'

import { CurrencyModalView } from './CurrencySearchModal'
import { ManageLists } from './ManageLists'
import ManageTokens from './ManageTokens'

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-flow: column;
`

const ToggleWrapper = styled.div`
  justify-content: space-between;
  background-color: ${({ theme }) => theme.bg3};
  border-radius: 12px;
  padding: 6px;
`

const ToggleOption = styled.div<{ active?: boolean }>`
  width: 48%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: 600;
  background-color: ${({ theme, active }) => (active ? theme.bg1 : theme.bg3)};
  color: ${({ theme, active }) => (active ? theme.text1 : theme.text2)};
  user-select: none;

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

export default function Manage({
  onDismiss,
  setModalView,
  setImportList,
  setImportToken,
  setListUrl,
}: {
  onDismiss: () => void
  setModalView: (view: CurrencyModalView) => void
  setImportToken: (token: Token) => void
  setImportList: (list: TokenList) => void
  setListUrl: (url: string) => void
}) {
  // toggle between tokens and lists
  const [showLists, setShowLists] = useState(true)

  return (
    <Wrapper>
      <div className="flex flex-col">
        <div className="flex justify-between py-3 px-6">
          <ArrowLeft style={{ cursor: 'pointer' }} onClick={() => setModalView(CurrencyModalView.search)} />
          <span className="text-xl">
            <span>Manage</span>
          </span>
          <X onClick={onDismiss} className="mt-1" />
        </div>
      </div>
      <br />
      <div className="flex flex-col pb-0">
        <ToggleWrapper className="flex">
          <ToggleOption onClick={() => setShowLists(!showLists)} active={showLists}>
            <span>Lists</span>
          </ToggleOption>
          <ToggleOption onClick={() => setShowLists(!showLists)} active={!showLists}>
            <span>Tokens</span>
          </ToggleOption>
        </ToggleWrapper>
      </div>
      {showLists ? (
        <ManageLists setModalView={setModalView} setImportList={setImportList} setListUrl={setListUrl} />
      ) : (
        <ManageTokens setModalView={setModalView} setImportToken={setImportToken} />
      )}
    </Wrapper>
  )
}
