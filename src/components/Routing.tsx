import { SwapQuote } from '@/src/types/SwapQuote'
import { AggregatorId } from '@/src/enums/AggregatorId'
import { OneInchLiquiditySource, OneInchLuqidityPoolRoute, OpenOceanSubRoute } from '@/src/types/AggApiTypes'
import { useAllTokens } from '@/src/hooks/useTokenList'
import { WrappedTokenInfo } from '@/src/state/lists/wrappedTokenInfo'
import { Token } from '@uniswap/sdk-core'
import { toChecksumAddress } from '@walletconnect/utils'
import { sourceMappingOpenOceanOneInch, sourceMappingZeroXOneInch } from '@/src/constants/aggregators'
import { ChainId } from '@/src/enums/ChainId'
import {BiFastForward} from 'react-icons/bi'
import { getCurrencyLogoURI, isNativeAddress, shortenAddress } from '@/src/utils'
import { native } from '@/src/constants/currencies'

interface SwapRoutingProps {
  bestQuote: SwapQuote
  inchSources: {
    [id:string]: OneInchLiquiditySource
  }
  chainId: ChainId
}

function Routing({bestQuote, inchSources, chainId}: SwapRoutingProps) {
  // console.log(`Routing bestQuote sources ${bestQuote.protocolId}`, bestQuote.sources)
  const aggId = bestQuote.protocolId

  const allTokens: { [address: string]: Token|WrappedTokenInfo } = useAllTokens()

  return (
    <>
      <div className={aggId === AggregatorId.OneInch ? "flex flex-col" : "flex flex-row flex-wrap justify-center"}>
        {aggId === AggregatorId.OpenOcean &&
          bestQuote.sources.routes[0].subRoutes.map((r:OpenOceanSubRoute, index: number) => {
            // console.log(r)
            const fromTokenAddr = toChecksumAddress(r.from)
            const toTokenAddr = toChecksumAddress(r.to)
            const fromToken = allTokens[fromTokenAddr] && allTokens[fromTokenAddr] instanceof WrappedTokenInfo ? allTokens[fromTokenAddr] as WrappedTokenInfo : isNativeAddress(fromTokenAddr) ? native[chainId] : undefined
            const toToken = allTokens[toTokenAddr] && allTokens[toTokenAddr] instanceof WrappedTokenInfo ? allTokens[toTokenAddr] as WrappedTokenInfo : isNativeAddress(toTokenAddr) ? native[chainId] : undefined
            const fromLogoURI = getCurrencyLogoURI(fromToken)
            const toLogoURI = getCurrencyLogoURI(toToken)

            return (
              <div
                key={'oo' + index + fromTokenAddr + toTokenAddr}
                className="flex justify-center flex-col m-3 p-2.5"
              >
                <div className="flex justify-center items-center">
                  {fromToken &&
                    <img src={fromLogoURI} className="w-7 h-7 rounded-full m-1" title={fromToken.symbol} alt={fromToken.symbol}  />
                  }
                  <BiFastForward stroke={'#ffff00'} />
                  {toToken &&
                    <img src={toLogoURI} className="w-7 h-7 rounded-full m-1" title={toToken.symbol} alt={toToken.symbol}  />
                  }
                </div>
                <div className="flex justify-center">
                  {Object.keys(r.dexes).map((i: string, index: number) => {
                    const dex = r.dexes[index]
                    // console.log(dex)
                    const inchSource:OneInchLiquiditySource|undefined = sourceMappingOpenOceanOneInch[chainId][dex.dex] ? inchSources[sourceMappingOpenOceanOneInch[chainId][dex.dex]] : undefined
                    // console.log(inchSource)

                    return inchSource ? (
                      <div key={'oo-source' + i + fromTokenAddr + toTokenAddr}>
                        <img className="h-9 w-9 m-1.5" src={inchSource.img_color} alt={inchSource.title} title={inchSource.title} />
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            )
          })
        }

        {Object.keys(bestQuote.sources).map(( i, index) => {
          if (aggId === AggregatorId.OneInch) {
            const routeBlock = bestQuote.sources[i]
            // console.log('Route block', routeBlock)

            return (
              <div key={'1i' + index} className="flex justify-center flex-wrap">
                {routeBlock.map((tokenToRoute:OneInchLuqidityPoolRoute[], index:number) => {
                  const fromTokenAddr = toChecksumAddress(tokenToRoute[0].fromTokenAddress)
                  const toTokenAddr = toChecksumAddress(tokenToRoute[0].toTokenAddress)
                  const fromToken = allTokens[fromTokenAddr] && allTokens[fromTokenAddr] instanceof WrappedTokenInfo ? allTokens[fromTokenAddr] as WrappedTokenInfo : isNativeAddress(fromTokenAddr) ? native[chainId] : undefined
                  const token = allTokens[toTokenAddr] && allTokens[toTokenAddr] instanceof WrappedTokenInfo ? allTokens[toTokenAddr] as WrappedTokenInfo : isNativeAddress(toTokenAddr) ? native[chainId] : undefined
                  const fromLogoURI = getCurrencyLogoURI(fromToken)
                  const toLogoURI = getCurrencyLogoURI(token)

                  return (
                    <div key={'' + index + fromTokenAddr + toTokenAddr} className="flex-col dark:bg-transparent m-1 pt-3 pb-2 px-2 rounded-2xl">
                      <div className="text-sm flex justify-center mb-1 items-center">
                        {fromLogoURI ?
                          <img src={fromLogoURI} className="w-7 h-7 rounded-full m-1" title={fromToken?.symbol} alt={fromToken?.symbol}  />
                          :
                          <span>{shortenAddress(fromTokenAddr, 2)}</span>
                        }
                        <BiFastForward stroke={'#ffff00'} />
                        {toLogoURI &&
                          <img src={toLogoURI} className="w-7 h-7 rounded-full m-1" title={token?.symbol} alt={token?.symbol}  />
                        }
                      </div>
                      <div className="inline-flex flex-row flex-wrap justify-center">
                        {tokenToRoute.map((liquidityPoolRoute:OneInchLuqidityPoolRoute, index) => {
                          // console.log('liquidityPoolRoute', liquidityPoolRoute)

                          return (
                            <div key={'' + index + fromTokenAddr + toTokenAddr + liquidityPoolRoute.name} className="flex text-sm">
                              {inchSources[liquidityPoolRoute.name] && (
                                <img className="h-6 w-6 mx-1.5 my-1.5" src={inchSources[liquidityPoolRoute.name].img_color} alt={liquidityPoolRoute.name} title={inchSources[liquidityPoolRoute.name].title} />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          } else if (aggId === AggregatorId.ZeroX) {
            const order = bestQuote.sources[i]
            // console.log('0x or:', order)

            const fromTokenAddr = toChecksumAddress(order.takerToken)
            const toTokenAddr = toChecksumAddress(order.makerToken)
            const fromToken = allTokens[fromTokenAddr] && allTokens[fromTokenAddr] instanceof WrappedTokenInfo ? allTokens[fromTokenAddr] as WrappedTokenInfo : undefined
            const toToken = allTokens[toTokenAddr] && allTokens[toTokenAddr] instanceof WrappedTokenInfo ? allTokens[toTokenAddr] as WrappedTokenInfo : undefined
            const inchSource:OneInchLiquiditySource|undefined = sourceMappingZeroXOneInch[chainId][order.source] ? inchSources[sourceMappingZeroXOneInch[chainId][order.source]] : undefined

            return (
              <div
                key={'0xOrder' + JSON.stringify(order)}
                className="inline-flex flex-col justify-center dark:bg-transparent m-3 p-2.5 rounded-2xl"
              >
                <div className="flex justify-center items-center">
                  {fromToken &&
                    <img src={fromToken.tokenInfo.logoURI} className="w-7 h-7 rounded-full m-1" title={fromToken.symbol} alt={fromToken.symbol}  />
                  }
                  <BiFastForward stroke={'#ffff00'} />
                  {toToken &&
                    <img src={toToken.tokenInfo.logoURI} className="w-7 h-7 rounded-full m-1" title={toToken.symbol} alt={toToken.symbol}  />
                  }
                </div>
                <div className="flex justify-center">
                  {inchSource && (
                    <img className="h-9 w-9 m-1.5" src={inchSource.img_color} alt={inchSource.title} title={inchSource.title} />
                  )
                  }
                </div>
              </div>
            )
          }
        })}
      </div>
    </>
  )
}

export default Routing