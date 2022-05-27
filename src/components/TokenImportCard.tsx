import { Token } from '@uniswap/sdk-core'
import { TokenList } from '@uniswap/token-lists'
import CurrencyLogo from '@/src/components/CurrencyLogo'
import ListLogo from '@/src/components/ListLogo'
import useActiveWeb3React from '@/src/hooks/useActiveWeb3React'
import { AlertCircle } from 'react-feather'
import styled, { useTheme } from 'styled-components'
import { ExplorerDataType, getExplorerLink } from '@/src/utils/getExplorerLink'

const AddressText = styled.div`
  color: blue;
  font-size: 12px;
  word-break: break-all;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 10px;
  `}
`
interface TokenImportCardProps {
  list?: TokenList
  token: Token
}
const TokenImportCard = ({ list, token }: TokenImportCardProps) => {
  const theme = useTheme()
  const { chainId } = useActiveWeb3React()
  return (
    <div className="bg-indigo-600 p-5">
      <div className="flex flex-col justify-center gap-3">
        <CurrencyLogo currency={token} size={'32px'} />
        <div className="flex flex-col gap-3 justify-center">
          <div>
            {token.symbol}
          </div>
          <div>
            {token.name}
          </div>
        </div>
        {chainId && (
          <a href={getExplorerLink(chainId, token.address, ExplorerDataType.ADDRESS)} target="_blank" rel="noreferrer">
            <AddressText>{token.address}</AddressText>
          </a>
        )}
        {list !== undefined ? (
          <div className="flex">
            {list.logoURI && <ListLogo logoURI={list.logoURI} size="16px" />}
            <div>
              <span>via {list.name} token list</span>
            </div>
          </div>
        ) : (
          <div className="flex rounded-l p-2">
            <div className="flex">
              <AlertCircle stroke={'#ff0000'} size="10px" />
              <div>
                <span>Unknown Source</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TokenImportCard
