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
          <X onClick={onDismiss} className="mt-1 cursor-pointer" />
        </div>
      </div>
      <br />
      <div className="flex flex-col pb-0">
        <ToggleWrapper className="flex mb-4">
          <div className={showLists ? "flex justify-center items-center text-xl font-bold rounded-2xl dark:bg-[#9e7a7c] bg-blue-400 w-1/2 py-1.5" : "flex justify-center items-center text-xl font-bold rounded-2xl dark:bg-transparent bg-transparent w-1/2 cursor-pointer py-1.5"} onClick={() => setShowLists(!showLists)}>
            <span>Lists</span>
          </div>
          <div className={!showLists ? "flex justify-center items-center text-xl font-bold rounded-2xl dark:bg-[#9e7a7c] bg-blue-400 w-1/2 py-1.5" : "flex justify-center items-center text-xl font-bold rounded-2xl dark:bg-transparent bg-transparent w-1/2 cursor-pointer py-1.5"} onClick={() => setShowLists(!showLists)}>
            <span>Tokens</span>
          </div>
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
