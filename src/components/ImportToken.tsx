import { Currency, Token } from '@uniswap/sdk-core'
import { TokenList } from '@uniswap/token-lists'
import { AlertCircle, ArrowLeft, X } from 'react-feather'
import { useAddUserToken } from '@/src/state/user/hooks'
import styled from 'styled-components'

import TokenImportCard from './TokenImportCard'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: auto;
`

interface ImportProps {
  tokens: Token[]
  list?: TokenList
  onBack?: () => void
  onDismiss?: () => void
  handleCurrencySelect?: (currency: Currency) => void
}

export function ImportToken(props: ImportProps) {
  const { tokens, list, onBack, onDismiss, handleCurrencySelect } = props

  const addToken = useAddUserToken()

  /*const unsupportedTokens = useUnsupportedTokens()
  const unsupportedSet = new Set(Object.keys(unsupportedTokens))
  const intersection = new Set(tokens.filter((token) => unsupportedSet.has(token.address)))
  if (intersection.size > 0) {
    return <BlockedToken onBack={onBack} onDismiss={onDismiss} blockedTokens={Array.from(intersection)} />
  }*/
  return (
    <Wrapper>
      <div className="flex flex-col gap-3 w-full">
        <div className="flex justify-between py-3 px-6">
          {onBack ? <ArrowLeft style={{ cursor: 'pointer' }} onClick={onBack} /> : <div />}
          <div className="text-xl">
            {tokens.length} tokens
          </div>
          {onDismiss ? <X onClick={onDismiss} /> : <div />}
        </div>
      </div>
      <br />
      <div className="flex flex-col gap-3 mb-4 p-4">
        <div className="flex justify-center text-center gap-3 p-3">
          <AlertCircle size={48} stroke={'#eeeeee'} strokeWidth={1} />
          <div>
            <span>
              This token doesn&apos;t appear on the active token list(s). Make sure this is the token that you want to
              trade.
            </span>
          </div>
        </div>
        {tokens.map((token) => (
          <TokenImportCard token={token} list={list} key={'import' + token.address} />
        ))}
        <button
          onClick={() => {
            tokens.map((token) => addToken(token))
            handleCurrencySelect && handleCurrencySelect(tokens[0])
          }}
          className="px-8 py-3 rounded-lg .token-dismiss-button"
        >
          <button className="dark:bg-amber-700 w-full text-xl py-2 font-bold">Import</button>
        </button>
      </div>
    </Wrapper>
  )
}
