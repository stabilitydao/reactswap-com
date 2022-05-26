import { Token } from '@uniswap/sdk-core'
import CurrencyLogo from './CurrencyLogo'
import { useIsTokenActive, useIsUserAddedToken } from '@/src/hooks/useCurrency'
import { CSSProperties } from 'react'
import { CheckCircle } from 'react-feather'
import styled from 'styled-components'

import { WrappedTokenInfo } from '@/src/state/lists/wrappedTokenInfo'

const TokenSection = styled.div<{ dim?: boolean }>`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto;
  grid-gap: 16px;
  align-items: center;

  opacity: ${({ dim }) => (dim ? '0.4' : '1')};
`

const CheckIcon = styled(CheckCircle)`
  height: 16px;
  width: 16px;
  margin-right: 6px;
  stroke: ${({ theme }) => theme.green1};
`

const NameOverflow = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  font-size: 12px;
`

export default function ImportRow({
  token,
  style,
  dim,
  showImportView,
  setImportToken,
}: {
  token: Token
  style?: CSSProperties
  dim?: boolean
  showImportView: () => void
  setImportToken: (token: Token) => void
}) {

  // check if already active on list or local storage tokens
  const isAdded = useIsUserAddedToken(token)
  const isActive = useIsTokenActive(token)

  const list = token instanceof WrappedTokenInfo ? token.list : undefined

  return (
    <TokenSection style={style}>
      <CurrencyLogo currency={token} size={'24px'} style={{ opacity: dim ? '0.6' : '1' }} />
      <div className="flex flex-col gap-2"  style={{ opacity: dim ? '0.6' : '1' }}>
        <div className="flex">
          <span>{token.symbol}</span>
          <span className="text-gray-500">
            <NameOverflow title={token.name}>{token.name}</NameOverflow>
          </span>
        </div>
        {list && list.logoURI && (
          <div className="flex">
            <span className="text-sm mr-2">
              <span>via {list.name} </span>
            </span>
            <img src={list.logoURI} className="h-10 w-10" />
          </div>
        )}
      </div>
      {!isActive && !isAdded ? (
        <button
          className="btn px-4 py-2 font-bold"
          onClick={() => {
            setImportToken && setImportToken(token)
            showImportView()
          }}
        >
          <span>Import</span>
        </button>
      ) : (
        <div className="flex">
          <CheckIcon />
          <span>
            <span>Active</span>
          </span>
        </div>
      )}
    </TokenSection>
  )
}
