import {SwapQuote} from '@/src/types/SwapQuote'
import {useAllTokens} from '@/src/hooks/useTokenList'
import {WrappedTokenInfo} from '@/src/state/lists/wrappedTokenInfo'
import {Token} from '@uniswap/sdk-core'
import {toChecksumAddress} from '@walletconnect/utils'
import {sourceMappingOneInch, sourceMappingOpenOcean, sourceMappingZeroX,} from '@/src/constants/aggregators'
import {ChainId} from '@/src/enums/ChainId'
import {BiFastForward} from 'react-icons/bi'
import {getCurrencyLogoURI, isNativeAddress, shortenAddress} from '@/src/utils'
import {native} from '@/src/constants/currencies'
import {protocols} from "@/src/constants/protocols";
import {Protocol} from "@/src/types/Protocol";
import {ProtocolId} from "@/src/enums/ProtocolId";
import {OpenOceanSubRoute} from "@/src/agg/OpenOcean";
import {OneInchLuqidityPoolRoute} from "@/src/agg/OneInch";

interface SwapRoutingProps {
  bestQuote: SwapQuote
  chainId: ChainId
  showDexOnly?: boolean
}

function Routing({bestQuote, chainId, showDexOnly = false}: SwapRoutingProps) {
  // console.log(`Routing bestQuote sources ${bestQuote.protocolId}`, bestQuote.sources)
  const aggId = bestQuote.protocolId

  const allTokens: { [address: string]: Token|WrappedTokenInfo } = useAllTokens()

  if (showDexOnly) {
    const dexList: {[id in ProtocolId]?: Protocol} = {}
    if (bestQuote.sources) {
      if (aggId === ProtocolId.openocean) {
        bestQuote.sources.routes[0].subRoutes.forEach((r: OpenOceanSubRoute) => {
          Object.keys(r.dexes).forEach((i: string, index: number) => {
            const dex = r.dexes[index]
            const pId = sourceMappingOpenOcean[chainId][dex.dex]
            const protocol = protocols[pId]
            if (protocol) {
              dexList[pId] = protocol
            }
          })
        })
      } else if (aggId === ProtocolId.oneinch) {
        Object.keys(bestQuote.sources).forEach((i) => {
          const routeBlock = bestQuote.sources[i]
          routeBlock.forEach((tokenToRoute: OneInchLuqidityPoolRoute[]) => {
            tokenToRoute.forEach((liquidityPoolRoute: OneInchLuqidityPoolRoute) => {
              const pId = sourceMappingOneInch[chainId][liquidityPoolRoute.name]
              const protocol = protocols[pId]
              if (protocol) {
                dexList[pId] = protocol
              }
            })
          })
        })
      } else if (aggId === ProtocolId.zerox) {
        Object.keys(bestQuote.sources).forEach((i) => {
          const order = bestQuote.sources[i]
          const pId = sourceMappingZeroX[chainId][order.source]
          const protocol = protocols[pId]
          if (protocol) {
            dexList[pId] = protocol
          }
        })
      }
    }

    // console.log('dexlist:', dexList)

    return (
        <div className="flex lg:hidden xl:flex">
          {Object.keys(dexList).map(k => {
            const protocolId: ProtocolId = parseInt(k)
            const protocol = dexList[protocolId]
            return (
                <img className="w-6 h-6 mx-1" key={protocol?.title} src={protocol?.img} alt={protocol?.title}/>
            )
          })}
        </div>
    )
  }

  return (
    <>
      <div className={aggId === ProtocolId.oneinch ? "flex flex-col" : "flex flex-row flex-wrap justify-center"}>
        {aggId === ProtocolId.openocean &&
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
                    const protocol = sourceMappingOpenOcean[chainId][dex.dex] ? protocols[sourceMappingOpenOcean[chainId][dex.dex]] : undefined
                    return protocol ? (
                      <div key={'oo-source' + i + fromTokenAddr + toTokenAddr}>
                        <img className="h-9 w-9 m-1.5" src={protocol.img} alt={protocol.title} title={protocol.title} />
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            )
          })
        }

        {bestQuote.sources && Object.keys(bestQuote.sources).map(( i, index) => {
          if (aggId === ProtocolId.oneinch) {
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
                          const protocol = protocols[sourceMappingOneInch[chainId][liquidityPoolRoute.name]]

                          return (
                            <div key={'' + index + fromTokenAddr + toTokenAddr + liquidityPoolRoute.name} className="flex text-sm">
                              {protocol && (
                                <img className="h-6 w-6 mx-1.5 my-1.5" src={protocol.img} alt={protocol.title} title={protocol.title} />
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
          } else if (aggId === ProtocolId.zerox) {
            const order = bestQuote.sources[i]
            // console.log('0x or:', order)

            const fromTokenAddr = toChecksumAddress(order.takerToken)
            const toTokenAddr = toChecksumAddress(order.makerToken)
            const fromToken = allTokens[fromTokenAddr] && allTokens[fromTokenAddr] instanceof WrappedTokenInfo ? allTokens[fromTokenAddr] as WrappedTokenInfo : undefined
            const toToken = allTokens[toTokenAddr] && allTokens[toTokenAddr] instanceof WrappedTokenInfo ? allTokens[toTokenAddr] as WrappedTokenInfo : undefined
            const protocol = protocols[sourceMappingZeroX[chainId][order.source]];

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
                  {protocol && (
                    <img className="h-9 w-9 m-1.5" src={protocol.img} alt={protocol.title} title={protocol.title} />
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