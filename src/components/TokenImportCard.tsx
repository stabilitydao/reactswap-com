import { Token } from '@uniswap/sdk-core'
import { TokenList } from '@uniswap/token-lists'
import CurrencyLogo from '@/src/components/CurrencyLogo'
import ListLogo from '@/src/components/ListLogo'
import useActiveWeb3React from '@/src/hooks/useActiveWeb3React'
import { AlertCircle } from 'react-feather'
import { ExplorerDataType, getExplorerLink } from '@/src/utils/getExplorerLink'

interface TokenImportCardProps {
  list?: TokenList
  token: Token
}

const TokenImportCard = ({ list, token }: TokenImportCardProps) => {
  const { chainId } = useActiveWeb3React()
  return (
    <div className="bg-indigo-600 p-5">
      <div className="flex flex-col justify-center gap-3">
        <CurrencyLogo currency={token} size={'32px'} />
        <div className="flex flex-col gap-3 justify-center">
          <div className="text-2xl font-bold">
            {token.symbol}
          </div>
          <div className="text-2xl">
            {token.name}
          </div>
        </div>
        {chainId && (
          <a className="dark:text-blue-300 " href={getExplorerLink(chainId, token.address, ExplorerDataType.ADDRESS)} target="_blank" rel="noreferrer">
            <span className="text-sm">{token.address}</span>
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
