import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import useActiveWeb3React from '@/src/hooks/useActiveWeb3React'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '@/src/state/swap/hooks'
import { useChainId } from '@/src/state/network/hooks'
import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { Field } from '@/src/state/swap/actions'
import CurrencyInputPanel from '@/components/CurrencyInputPanel'
import { AggregatorId } from '@/src/enums/AggregatorId'
import { aggregators } from '@/src/constants/aggregators'
import { SwapQuote } from '@/src/types/SwapQuote'
import { maxAmountSpend } from '@/src/utils/maxAmountSpend'
import { ApprovalState, useApproval } from '@/src/hooks/useApproval'
import JSBI from 'jsbi'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { TransactionResponse } from '@ethersproject/providers'
import Loader from '@/components/Loader'
import {HiSwitchVertical} from 'react-icons/hi'
import { useSetUserSlippageTolerance } from '@/src/state/user/hooks'
import { metarouter } from '@/src/constants/contracts'
import { useMetaRouterContract } from '@/src/hooks/useContract'
import Routing from '@/components/Routing'
import { OneInchLiquiditySource } from '@/src/types/AggApiTypes'
import { currencyId } from '@/src/utils/currencyId'
import { toast } from 'react-toastify';
import { chainIdMapping, DexScreener, Pair } from '@/src/dexData/DexScreener'
import { currencyAddress } from '@/src/utils/currencyAddress'
import DexScreenerChart from '@/components/DexScreenerChart'
import ConnectWallet from '@/components/ConnectWallet'
import { ChainId } from '@/src/enums/ChainId'
import {Contract, ContractTransaction} from "ethers";
import {fee} from "@/src/constants/fees";
import {calcOutputExactMin} from "@/src/utils";
import {MdExpandLess, MdExpandMore} from "react-icons/md";
import QuestionHelper from "@/components/QuestionHelper";

function Swap() {
  // console.log('Swap render')
  const router = useRouter()
  const chainId = useChainId()
  const { account, library } = useActiveWeb3React()

  // updates the swap state to use the defaults for a given network and url query string
  /*const loadedUrlParams =*/ useDefaultsFromURLSearch(chainId)
  const { inputValue } = useSwapState()
  const {
    allowedSlippage,
    parsedAmount,
    inputCurrency,
    outputCurrency,
    inputBalance,
  } = useDerivedSwapInfo()

  // component state
  const [quotes, setQuotes] = useState<{[id in AggregatorId|string]?: SwapQuote}>({})
  const [pendingApproval, setPendingApproval] = useState<boolean>(false)
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  const [approved, setApproved] = useState<boolean>(false)
  const [txData, setTxData] = useState<TransactionRequest|undefined>()
  const [pendingSwap, setPendingSwap] = useState<boolean>(false)
  const [slippageInput, setSlippageInput] = useState(allowedSlippage.toFixed(1))
  const [slippageError, setSlippageError] = useState<'invalid input' | false>(false)
  const [oneInchSources, setOneInchSources] = useState<{[id:string]:OneInchLiquiditySource}>({})
  const [chartPairAddress, setChartPairAddress] = useState<string|undefined>()
  const [pairs, setPairs] = useState<{[id:string]:Pair}>({})
  const [seconds, setSeconds] = useState(0)
  const [manualSelectedAgg, setManualSelectedAgg] = useState<string|undefined>()
  const [showRouting, setShowRouting] = useState<boolean>(false)

  // console.debug('inputCurrency:', inputCurrency?.symbol)
  // console.debug('outputCurrency:', outputCurrency?.symbol)
  // console.debug('inputBalance:', inputBalance)
  // console.log('allowedSlippage', allowedSlippage.toFixed())

  // auto update quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 10);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // quoting tokens data
  const inputTokenAddress = inputCurrency ? currencyAddress(inputCurrency) : undefined
  const outputTokenAddress = outputCurrency ? currencyAddress(outputCurrency) : undefined
  const dexScreener = new DexScreener()
  useEffect(() => {
    // console.log('input output token effect')
    let isSubscribed = true
    const loadTokensData = async () => {
      if (inputTokenAddress && outputTokenAddress) {
        const inputPairs = await dexScreener.tokens([inputTokenAddress])
        // console.log(a)
        const outputPairs = await dexScreener.tokens([outputTokenAddress])
        const searchPairs = await dexScreener.search(`${inputTokenAddress} ${outputTokenAddress}`)

        const foundPairs:{[id:string]:Pair} = {};

        [...inputPairs?.pairs || [], ...outputPairs?.pairs || [], ...searchPairs?.pairs || [],]
          .filter(pair => pair.chainId == chainIdMapping[ChainId.POLYGON])
            .sort((a, b) => a?.liquidity?.usd && b?.liquidity?.usd ?  a?.liquidity?.usd - b?.liquidity?.usd : 0)
          .forEach(pair => {
            foundPairs[pair.pairAddress] = pair
        })
        if (isSubscribed) {
          setPairs(foundPairs)
        }
      }
    }

    loadTokensData()
    return () => {isSubscribed = false}
  }, [inputTokenAddress, outputTokenAddress])

  useEffect(() => {
    let isSubscribed = true
    if (!chartPairAddress || !Object.keys(pairs).includes(chartPairAddress)) {
      let bestPair

      Object.keys(pairs)
          .forEach(pairAddr => {
        const pair = pairs[pairAddr]
        if (
          (
            pair.baseToken.address == inputTokenAddress
            && pair.quoteToken.symbol == (outputCurrency?.isToken ? outputCurrency.symbol : outputCurrency?.wrapped.symbol)
          ) || (
            pair.baseToken.address == outputTokenAddress
            && pair.quoteToken.symbol == (inputCurrency?.isToken ? inputCurrency.symbol : inputCurrency?.wrapped.symbol)
          )
        ) {
          bestPair = pairAddr
          // setChartPairAddress(pairAddr)
        }
      })

      if (!bestPair && Object.keys(pairs).length > 0) {
        bestPair = pairs[Object.keys(pairs)[0]].pairAddress
      }

      if (isSubscribed) {
        setChartPairAddress(bestPair)
      }
    }
    return () => {isSubscribed = false}
  }, [JSON.stringify(pairs), inputTokenAddress, outputTokenAddress])


  // Quoting DeX aggregators for swap quotes
  useEffect(() => {
    let isSubscribed = true
    // console.log('Quote effect hook. deps:', chainId, inputCurrency?.symbol, outputCurrency?.symbol, parsedAmount?.quotient.toString(), allowedSlippage.quotient.toString())
    if (inputCurrency && outputCurrency && parsedAmount) {
      for (const aggId in aggregators[chainId]) {
        console.log(`Quoting ${aggId}..`)
        aggregators[chainId][aggId].getQuote(
          inputCurrency,
          outputCurrency,
          parsedAmount,
          parseFloat(allowedSlippage.toFixed(2)),
          account ?? undefined
        ).then((quote:SwapQuote) => {
          console.log(`${aggId} reply quote data:`, quote)
          if (!quotes[aggId] || quotes[aggId]?.outputAmountFixed != quote.outputAmountFixed) {
            if (isSubscribed) {
              // setQuotes(q => ({...q, [aggId]: quote}))
              setQuotes(q => Object.entries({...q, [aggId]: quote})
                .sort(([,a],[,b]) => b?.outputAmountFixed && a?.outputAmountFixed ? parseFloat(b.outputAmountFixed) - parseFloat(a.outputAmountFixed) : 0)
                .reduce((r, [k, v]) => ({ ...r, [k]: v }), {}))
            }
          }
        })
      }
    }

    return () => {isSubscribed = false}
  }, [
    chainId,
    inputCurrency?.symbol,
    outputCurrency?.symbol,
    parsedAmount?.quotient.toString(),
    allowedSlippage.quotient.toString(),
    seconds
  ])

  // calculate best swap quote
  const bestQuote: SwapQuote|undefined = useMemo(()=> {
    let bestQuote: SwapQuote|undefined
    if (manualSelectedAgg) {
      bestQuote = quotes[manualSelectedAgg]
    } else {
      Object.keys(quotes).forEach(aggId => {
        const q = quotes[aggId]
        if (
            q && q.outputAmountFixed && parseFloat(q.outputAmountFixed) > 0
            && (
                !bestQuote
                || (bestQuote.outputAmountFixed && parseFloat(q.outputAmountFixed) > parseFloat(bestQuote.outputAmountFixed))
            )
        ) {
          bestQuote = q
        }
      })
    }
    return bestQuote
  }, [
      JSON.stringify(quotes),
      manualSelectedAgg
  ])
  // console.log('Quotes:', quotes)
  // console.log('BestQuote:', bestQuote)

  // check balance
  const insufficientBalance =
    inputBalance && parsedAmount?.greaterThan(inputBalance)

  // check approval
  const allowanceTarget:string = metarouter[chainId]
  const [approval, approveCallback] = useApproval(parsedAmount, allowanceTarget, pendingApproval)

  useEffect(() => {
    if (approval === ApprovalState.NOT_APPROVED && !pendingApproval && !approvalSubmitted) {
      setApproved(false)
    }
    if (approval === ApprovalState.PENDING) {
      setPendingApproval(true)
      setApprovalSubmitted(true)
    }
    if (approval === ApprovalState.APPROVED) {
      setApproved(true)
      setPendingApproval(false)
      setApprovalSubmitted(false)
    }
  }, [approval, approvalSubmitted])

  const needToApprove =
    inputCurrency
    && outputCurrency
    && parsedAmount
    && !insufficientBalance
    && !pendingApproval
    && !inputCurrency?.isNative
    && approval === ApprovalState.NOT_APPROVED
    && !approved
  // console.log('Approval state:', approval)
  // console.log('Need to approve:', needToApprove)

  // build swap tx
  useEffect(() => {
    let isSubscribed = true
    const getTxData = async () => {
      // console.debug('getTxData', account, inputCurrency, parsedAmount, outputCurrency, inputBalance?.greaterThan(JSBI.BigInt(0)), !needToApprove, bestQuote, !insufficientBalance)
      if (
        account
        && inputCurrency
        && parsedAmount
        && outputCurrency
        && inputBalance?.greaterThan(JSBI.BigInt(0))
        && !needToApprove
        && bestQuote
        && !insufficientBalance
      ) {
        const aggId = bestQuote.protocolId
        console.log(`Buildtx ${aggId} await`)
        const txData =  await aggregators[chainId][aggId].buildTx(
          inputCurrency,
          outputCurrency,
          parsedAmount,
          allowanceTarget,
          bestQuote.to,
          bestQuote,
          parseFloat(allowedSlippage.toFixed(2))
        )
        console.log('Buildtx setTxData:', txData)
        if (isSubscribed) {
          setTxData(txData)
        }
      } else {
        setTxData(undefined)
      }
    }

    getTxData()
    return () => {isSubscribed = false}
  }, [
    chainId,
    inputBalance?.quotient.toString(),
    parsedAmount?.quotient.toString(),
    bestQuote?.outputAmount,
    needToApprove,
    account,
    insufficientBalance,
    allowedSlippage.quotient.toString()
  ])
  const canSwap =
    inputCurrency
    && outputCurrency
    && parsedAmount
    && !needToApprove
    && !pendingApproval
    && bestQuote
    && !insufficientBalance
    && txData
  // console.log('Swap tx:', txData)
  // console.log('canSwap:', canSwap)

  // ui action handlers
  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()

  function handleChangeSlippageInput(value: string) {
    // populate what the user typed and clear the error
    setSlippageInput(value)
    setSlippageError(false)

    if (value.length === 0) {
      setUserSlippageTolerance('auto')
    } else {
      const parsed = Math.floor(Number.parseFloat(value) * 100)

      if (!Number.isInteger(parsed) || parsed < 0 || parsed > 5000) {
        setUserSlippageTolerance('auto')
        if (value !== '.') {
          setSlippageError('invalid input')
        }
      } else {
        setUserSlippageTolerance(new Percent(parsed, 10_000))
      }
    }
  }

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(value)

      router.replace(`?chainId=${chainId}&inputCurrency=${inputCurrency ? currencyId(inputCurrency) : ''}&outputCurrency=${outputCurrency ? currencyId(outputCurrency) : ''}&exactAmount=${value}`, undefined, { shallow: true })
      setQuotes({})
    },
    [onUserInput, inputCurrency, outputCurrency]
  )

  const handleInputSelect = useCallback(
    (inputCurrency:Currency) => {
      onCurrencySelection(Field.INPUT, inputCurrency)
      const inputParamValue = inputCurrency.isToken ? inputCurrency.address : 'ETH'
      const outputParamValue = outputCurrency ? outputCurrency.isToken ? outputCurrency.address : 'ETH' : undefined

      if (outputParamValue) {
        router.replace(`?chainId=${chainId}&inputCurrency=${inputParamValue}&outputCurrency=${outputParamValue}&exactAmount=${inputValue}`, undefined, { shallow: true })
      } else {
        router.replace(`?chainId=${chainId}&inputCurrency=${inputParamValue}&exactAmount=${inputValue}`, undefined, { shallow: true })
      }

      setQuotes({})
      setApproved(false)
      setApprovalSubmitted(false)
    },
    [onCurrencySelection, outputCurrency, chainId, inputValue]
  )

  const handleOutputSelect = useCallback(
    (outputCurrency:Currency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
      const inputParamValue = inputCurrency ? inputCurrency.isToken ? inputCurrency.address : 'ETH' : undefined
      const outputParamValue = outputCurrency.isToken ? outputCurrency.address : 'ETH'

      if (inputParamValue) {
        router.replace(`?chainId=${chainId}&inputCurrency=${inputParamValue}&outputCurrency=${outputParamValue}&exactAmount=${inputValue}`, undefined, { shallow: true })
      } else {
        router.replace(`?chainId=${chainId}&outputCurrency=${outputParamValue}&exactAmount=${inputValue}`, undefined, { shallow: true })
      }
      setQuotes({})
    },
    [onCurrencySelection, inputCurrency, chainId, inputValue]
  )

  const maxInputAmount: CurrencyAmount<Currency> | undefined = useMemo(
    () => maxAmountSpend(inputBalance),
    [inputBalance]
  )

  const handleMaxInput = useCallback(() => {
    if (maxInputAmount) {
      onUserInput(maxInputAmount.toExact())
    }
  }, [maxInputAmount, onUserInput])

  const handleApprove = useCallback(async () => {
    const res: { response: TransactionResponse; tokenAddress: string; spenderAddress: string } | undefined
      = await approveCallback()

    if (res) {
      setApprovalSubmitted(true)
      setPendingApproval(true)

      res.response.wait(1).then(() => {
        // console.log('approval tx confirmed')
        setPendingApproval(false)
        setApproved(true)
      })
    }
  }, [
    approveCallback,
    bestQuote
  ])

  const metarouterContract: Contract|null = useMetaRouterContract()

  const handleSwap = useCallback(async () => {
    // console.log('handle Swap')
    if (
      library
      && txData
      && txData.to
      && txData.data
      && !needToApprove
      && inputCurrency
      && outputCurrency
      && parsedAmount
    ) {
      metarouterContract?.swap(
        inputCurrency?.isNative ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : inputCurrency.address,
        outputCurrency?.isNative ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : outputCurrency.address,
        BigInt(parsedAmount.quotient.toString()),
        txData.to,
        txData.data,
        {
          value: txData.value,
        }
      ).then((response: ContractTransaction) => {
        setPendingSwap(true)

        response.wait(1).then(() => {
          setPendingSwap(false)
          toast.success('Swap done')
        }).catch(() => {
          setPendingSwap(false)
          toast.error('Swap failed')
        })
      }).catch((error: any) => {
        setPendingSwap(false)
        console.error(`Swap failed`, error)
        toast.error('Swap failed')
        // throw new Error(`Swap failed`)
      })
    }
  }, [
    bestQuote,
    txData,
    inputCurrency?.symbol,
    outputCurrency?.symbol
  ])

  const setUserSlippageTolerance = useSetUserSlippageTolerance()

  // load 1Inch liquidity sources for DeX logo images
  useEffect(() => {
    const run = async () => {
      const ls = await aggregators[chainId][AggregatorId.OneInch].getSources()
      const sources: {[id:string]:OneInchLiquiditySource} = {}
      ls.forEach((source: OneInchLiquiditySource) => {
        if (source.id) {
          sources[source.id] = source
        }
      })
      // console.debug('1Inch sources: ', sources)
      setOneInchSources(sources)
    }
    run()
  }, [])

  return (
    <div className="flex w-full mt-5 md:mt-0 mb-10 flex-wrap lg:flex-nowrap justify-center gap-5" style={{maxWidth: 1500}}>
      <div className="flex w-full flex-col md:flex-row lg:w-72 xl:w-full xl:max-w-md lg:flex-col items-center md:items-start mb-10 lg:justify-start">
        <div className="flex w-full md:max-w-md flex-col items-center">
          <div className="flex flex-col w-full max-w-sm lg:w-72 xl:w-full xl:max-w-md bg-[#fff3db] dark:bg-[#2d2d2d] pb-5 rounded-2xl border-2 border-transparent p-3 px-1 md:px-3 shadow-2xl dark:shadow-none dark:shadow-lg">
            <div className="flex text-sm pl-2">You sell</div>
            <CurrencyInputPanel
              field={Field.INPUT}
              value={inputValue}
              onUserInput={handleTypeInput}
              onCurrencySelect={handleInputSelect}
              currency={inputCurrency}
              otherCurrency={outputCurrency}
              onMax={handleMaxInput}
            />
          </div>
          <div className="h-10 flex justify-center items-center">
            <div title="Switch tokens">
              <HiSwitchVertical
                className="cursor-pointer"
                size="32"
                onClick={() => {
                  setApprovalSubmitted(false)
                  setQuotes({})
                  onSwitchTokens()
                }}
              />
            </div>
          </div>
          <div className="flex flex-col w-full max-w-sm lg:w-72 xl:w-full xl:max-w-md bg-[#fff3db] dark:bg-[#2d2d2d] pb-5 rounded-2xl border-2 border-transparent p-3 px-1 md:px-3 shadow-2xl dark:shadow-none dark:shadow-lg">
            <div className="flex text-sm pl-2">You buy</div>
            <CurrencyInputPanel
              field={Field.OUTPUT}
              value={bestQuote && bestQuote.outputAmountFixed ? bestQuote.outputAmountFixed : '0'}
              onCurrencySelect={handleOutputSelect}
              currency={outputCurrency}
              otherCurrency={inputCurrency}
            />
          </div>

          <div className="flex h-48 mt-5 mb-5 w-full max-w-sm lg:w-72 xl:w-full xl:max-w-md flex-col bg-[#fff3db] dark:bg-[#2d2d2d] rounded-2xl p-3 shadow-2xl dark:shadow-none dark:shadow-lg">
            <div className="flex dark:text-[#e1e1cd] font-bold">
              {bestQuote && bestQuote.outputAmountFixed && inputValue && chartPairAddress && pairs[chartPairAddress] &&
                  <div className="flex items-start flex-col">
                    <div className="text-xs">
                      1 {inputCurrency?.symbol} = {Math.round(1000000*parseFloat(bestQuote.outputAmountFixed) / inputValue)/ 1000000} {outputCurrency?.symbol} = ${inputCurrency?.symbol == pairs[chartPairAddress].baseToken.symbol ? pairs[chartPairAddress].priceUsd : Math.round(100*parseFloat(pairs[chartPairAddress].priceUsd || '0') * parseFloat(bestQuote.outputAmountFixed) / inputValue)/ 100}
                    </div>
                    <div className="text-xs">
                      1 {outputCurrency?.symbol} = {Math.round(1000000*parseFloat(inputValue) / parseFloat(bestQuote.outputAmountFixed))/ 1000000} {inputCurrency?.symbol} = ${inputCurrency?.symbol == pairs[chartPairAddress].baseToken.symbol ? Math.round(100*parseFloat(pairs[chartPairAddress].priceUsd || '0') * inputValue / parseFloat(bestQuote.outputAmountFixed))/ 100 : pairs[chartPairAddress].priceUsd}
                    </div>
                  </div>
              }
            </div>
            <div className="flex h-7 justify-start text-left dark:text-[#e1e1cd] font-bold">
              {bestQuote?.outputAmount && outputCurrency &&
                  <div className="text-xs">Output exact minimum
                    <QuestionHelper
                        text={
                          <span>
                quote - {slippageInput}% slippage - {fee}% fee
              </span>
                        }
                    />
                    <span className="mr-2" />
                    {calcOutputExactMin(CurrencyAmount.fromRawAmount(outputCurrency, JSBI.BigInt(bestQuote.outputAmount)), slippageInput)} {outputCurrency.symbol}</div>
              }
            </div>
            {1 &&
                <div className="flex justify-start mb-5 pt-3 items-center">
                  <div className="flex w-auto justify-end mr-5">max slippage</div>
                  <div>
                    <input
                        style={{
                          border: slippageError ? '2px solid red' : '2px solid transparent',
                          backgroundColor: slippageError ? '#ff0000' : 'transparent',
                        }}
                        onChange={(e) => handleChangeSlippageInput(e.target.value)}
                        className="w-12 py-1 px-2 text-right"
                        value={slippageInput}
                    /> %
                  </div>
                </div>
            }

            {!inputValue && account &&
              <div className="w-full">
                Enter amount
              </div>
            }
            {insufficientBalance && !pendingSwap && (
              <div className="dark:text-red-200 text-xl font-bold py-1 px-4 dark:bg-red-800 w-full">Insuffucient balance</div>
            )}
            {needToApprove && (
              <button className="w-full bg-teal-600 text-white dark:bg-blue-700 text-xl font-bold h-10 px-5" onClick={handleApprove}>Approve MetaRouter</button>
            )}
            {pendingApproval && (
              <div className="w-full flex justify-center items-center dark:bg-blue-800 text-xl font-bold h-10 px-5">
                <span className="mr-4">pending approval</span>
                <Loader stroke="#ffffff"/>
              </div>
            )}
            {!account &&
                <div className="w-full">
                  <ConnectWallet />
                </div>
            }
            {canSwap && !pendingSwap && (
              <button className="w-full bg-green-600 text-white shadow-2xl shadow-green-900 dark:bg-green-700 text-xl font-bold h-10 px-5" onClick={handleSwap}>Swap</button>          )}
            {pendingSwap && (
              <div className="w-full justify-center flex items-center dark:bg-blue-800 text-xl font-bold h-10 px-5">
                <span className="mr-4">pending swap</span>
                <Loader stroke="#ffffff"/>
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full max-w-md flex-col lg:max-w-md lg:w-full xl:w-full xl:max-w-md mt-0 items-center">
          {Object.keys(quotes).length > 0 &&
            <div className="flex w-full max-w-sm lg:w-72 lg:max-w-md xl:w-full flex-col bg-[#fff3db] dark:bg-[#2d2d2d]  rounded-2xl border-2 border-transparent shadow-2xl dark:shadow-none dark:shadow-lg">
              <div className="flex h-12 justify-start px-4 items-center cursor-pointer relative"  onClick={() => {
                setShowRouting(!showRouting)
              }}>
                <div className="flex w-20 text-md">Routing</div>
                <div className="w-20">{manualSelectedAgg ? (
                    <div className="text-orange-700 dark:text-orange-200 font-bold border-2 border-orange-700 dark:border-orange-200 px-2 rounded-lg">manual</div>
                ) : (
                    <div className="h-6 text-sm text-green-700 dark:text-green-200 font-bold border-2 border-green-700 dark:border-green-200 px-2 rounded-lg">auto</div>
                )}</div>
                <div className="w-32 md:w-48 lg:w-16 xl:w-48 flex items-center ml-5 flex-none overflow-hidden">
                  {bestQuote &&
                      <img src={aggregators[chainId][bestQuote.protocolId].logoURI} className="w-8 h-8" alt={bestQuote.protocolId}
                           title={bestQuote.protocolId}/>
                  }
                  {bestQuote &&
                      <Routing chainId={chainId} bestQuote={bestQuote} inchSources={oneInchSources} showDexOnly={true} />
                  }
                </div>
                <div className="absolute right-0 pr-2">
                  <span>{showRouting ? (
                      <MdExpandMore />
                  ) : (
                      <MdExpandLess />
                  )}</span>
                </div>
              </div>

              <div style={{
                maxHeight: showRouting ? 1000 : 0,
                overflow: 'hidden',
              }}>
                <div className="flex text-sm pl-4 mb-2 md:mb-1 mt-3">Quotes</div>
                {quotes && parseFloat(inputValue) > 0 && Object.keys(quotes).map((aggId, index) => {
                  const isSelected = manualSelectedAgg == aggId
                  const isBestQuote = index == 0

                  return (
                      <div key={aggId} className={isSelected ? "flex pl-2 py-2 items-center w-full border-2 dark:border-orange-200 rounded-xl cursor-pointer" : "flex pl-2 py-2 items-center w-full cursor-pointer border-2 border-transparent"} onClick={() => {
                        if (manualSelectedAgg && isSelected) {
                          setManualSelectedAgg(undefined)
                        } else {
                          setManualSelectedAgg(aggId)
                        }
                      }}
                      >
                        <img src={aggregators[chainId][aggId].logoURI} className="w-8 h-8" alt={aggId} title={aggId} />
                        <div className="text-lg pl-4">
                          {isBestQuote ? (
                              <span className="dark:text-teal-200">{quotes[aggId]?.outputAmountFixed}</span>
                          ) : quotes[aggId]?.outputAmountFixed}
                          {quotes[aggId]?.error && (
                              <span className="text-sm text-left">{quotes[aggId]?.error}</span>
                          )}
                        </div>
                      </div>
                  )
                } )}
                <div className="mt-4 flex text-sm pl-4 md:mb-2">Route</div>
                <div>
                  {bestQuote &&
                      <Routing chainId={chainId} bestQuote={bestQuote} inchSources={oneInchSources} />
                  }
                </div>
              </div>
            </div>
          }

        </div>
      </div>
      <div className="flex w-full">
        {chartPairAddress && (
          <div className="flex flex-col w-full">
            <div className="flex flex-col">
              <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#392b2c] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-5"
                      value={chartPairAddress}
                      onChange={event => {
                        const pair = event.target.value
                        setChartPairAddress(pair)
                        // console.log(event.target.value)
                      }}
              >
                {Object.keys(pairs).map(pairAddr => {
                  // console.log(pairs[pairAddr])
                  const pair = pairs[pairAddr]
                  return (
                    <option
                      value={pairAddr}
                      key={pairAddr}
                      className="flex gap-4 w-full"
                    >
                      {pair.baseToken.symbol}/{pair.quoteToken.symbol} on {pair.dexId}
                      {` ${pairAddr.substring(0, 3 + 2)}...${pairAddr.substring(pairAddr.length - 3)} `}
                      Liquidity: ${pair.liquidity?.usd},
                      Volume 24h: ${pair.volume.h24}
                    </option>
                  )
                })}
              </select>
            </div>
            <DexScreenerChart pairAddress={chartPairAddress} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Swap