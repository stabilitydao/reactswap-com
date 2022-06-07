import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from '@/src/state/swap/hooks'
import { useChainId } from '@/src/state/network/hooks'
import { Currency, CurrencyAmount, Percent} from '@uniswap/sdk-core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Field } from '@/src/state/swap/actions'
import CurrencyInputPanel from '@/components/CurrencyInputPanel'
import { AggregatorId } from '@/src/enums/AggregatorId'
import { aggregators } from '@/src/constants/aggregators'
import { SwapQuote } from '@/src/types/SwapQuote'
import { maxAmountSpend } from '@/src/utils/maxAmountSpend'
import { ApprovalState, useApproval } from '@/src/hooks/useApproval'
import JSBI from 'jsbi'
import useActiveWeb3React from '@/src/hooks/useActiveWeb3React'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { TransactionResponse } from '@ethersproject/providers'
import Loader from '@/components/Loader'
import { ArrowDown } from 'react-feather'
import { useSetUserSlippageTolerance } from '@/src/state/user/hooks'
import { metarouter } from '@/src/constants/contracts'
import { useMetaRouterContract } from '@/src/hooks/useContract'

function Swap() {
  // console.log('Swap render')
  const chainId = useChainId()
  const { account, library } = useActiveWeb3React()
  // const loadedUrlParams = useDefaultsFromURLSearch(chainId)

  const [quotes, setQuotes] = useState<{[id in AggregatorId|string]?: SwapQuote}>({})
  const allowanceTarget:string = metarouter[chainId]
  const [pendingApproval, setPendingApproval] = useState<boolean>(false)
  const [approved, setApproved] = useState<boolean>(false)
  const [txData, setTxData] = useState<TransactionRequest|undefined>()
  const [pendingSwap, setPendingSwap] = useState<boolean>(false)

  /*const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]*/
  /*const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )*/

  // const defaultTokens = useAllTokens()
  /*const importTokensNotInDefault = useMemo(
    () =>
      urlLoadedTokens &&
      urlLoadedTokens
        .filter((token: Token) => {
          return !Boolean(token.address in defaultTokens)
        })
        .filter((token: Token) => {
          // Any token addresses that are loaded from the shorthands map do not need to show the import URL
          const supported = chainId in ChainId
          if (!supported) return true
          return !Object.keys(TOKEN_SHORTHANDS).some((shorthand) => {
            const shorthandTokenAddress = TOKEN_SHORTHANDS[shorthand][chainId]
            return shorthandTokenAddress && shorthandTokenAddress === token.address
          })
        }),
    [chainId, defaultTokens, urlLoadedTokens]
  )*/

  const { inputValue, inputCurrencyId, outputCurrencyId } = useSwapState()

  const {
    allowedSlippage,
    parsedAmount,
    inputCurrency,
    outputCurrency,
    inputBalance,
  } = useDerivedSwapInfo()

  // console.log('allowedSlippage', allowedSlippage.toFixed())

  const maxInputAmount: CurrencyAmount<Currency> | undefined = useMemo(
    () => maxAmountSpend(inputBalance),
    [inputBalance]
  )

  useEffect(() => {
    let isSubscribed = true

    if (inputCurrency && outputCurrency && parsedAmount) {
      for (const aggId in aggregators[chainId]) {
        if (!quotes[aggId] || quotes[aggId]?.inputAmount != parsedAmount.quotient.toString() || quotes[aggId]?.outputCurrencyId != outputCurrencyId) {
          console.log(`Quoting ${aggId}..`)
          aggregators[chainId][aggId].getQuote(
            inputCurrency,
            outputCurrency,
            parsedAmount,
            parseFloat(allowedSlippage.toFixed(2)),
            account ?? undefined
          ).then(quote => {
            console.log(`${aggId} reply quote data:`, quote)
            if (!quotes[aggId] || quotes[aggId]?.outputAmountFixed != quote.outputAmountFixed) {
              if (isSubscribed) {
                setQuotes(q => ({...q, [aggId]: quote}))
              }
            }
          })
        }
      }
    }

    return () => {isSubscribed = false}
  }, [
    chainId,
    inputCurrencyId,
    outputCurrencyId,
    parsedAmount?.quotient.toString(),
    allowedSlippage
  ])

  const bestQuote: SwapQuote|undefined = useMemo(()=> {
    let bestQuote: SwapQuote|undefined
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
    return bestQuote
  }, [
    JSON.stringify(quotes)
  ])

  // console.log('Quotes:', quotes)
  // console.log('BestQuote:', bestQuote)

  // check balance
  const insufficientBalance =
    inputBalance && parsedAmount?.greaterThan(inputBalance)

  // check approval
  const [approval, approveCallback] = useApproval(parsedAmount, allowanceTarget, pendingApproval)

  // console.log('Approval state:', approval)

  useEffect(() => {
    if (approval === ApprovalState.NOT_APPROVED) {
      setApproved(false)
    }
    if (approval === ApprovalState.PENDING) {
      setPendingApproval(true)
    }
    if (approval === ApprovalState.APPROVED) {
      setApproved(true)
      setPendingApproval(false)
    }
  }, [approval])

  const needToApprove =
    inputCurrency
    && outputCurrency
    && parsedAmount
    && !insufficientBalance
    && !pendingApproval
    && !inputCurrency?.isNative
    && approval === ApprovalState.NOT_APPROVED
    && !approved


  // build tx
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
        // console.log('Buildtx setTxData')
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

  // console.log('Swap tx:', txData)

  const canSwap =
    inputCurrency
    && outputCurrency
    && parsedAmount
    && !needToApprove
    && !pendingApproval
    && bestQuote
    && !insufficientBalance
    && txData

  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(value)
      setQuotes({})
    },
    [onUserInput]
  )

  const handleInputSelect = useCallback(
    (inputCurrency:Currency) => {
      onCurrencySelection(Field.INPUT, inputCurrency)
      setQuotes({})
      setApproved(false)
    },
    [onCurrencySelection]
  )

  const handleOutputSelect = useCallback(
    (outputCurrency:Currency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
      setQuotes({})
    },
    [onCurrencySelection]
  )

  const handleMaxInput = useCallback(() => {
    if (maxInputAmount) {
      onUserInput(maxInputAmount.toExact())
    }
  }, [maxInputAmount, onUserInput])

  const handleApprove = useCallback(async () => {
    const res: { response: TransactionResponse; tokenAddress: string; spenderAddress: string } | undefined
      = await approveCallback()

    setPendingApproval(true)

    if (res) {
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

  const metarouterContract = useMetaRouterContract()

  const handleSwap = useCallback(async () => {
    // console.log('handle Swap')
    if (library && txData && !needToApprove && inputCurrencyId && outputCurrencyId && parsedAmount) {
      metarouterContract?.swap(
        inputCurrency?.isNative ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : inputCurrencyId,
        outputCurrency?.isNative ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : outputCurrencyId,
        BigInt(parsedAmount.quotient.toString()),
        // @ts-ignore
        txData.to,
        txData.data,
        {
          value: txData.value,
        }
      ).then((response) => {
        setPendingSwap(true)
        onUserInput('')

        response.wait(1).then(() => {
          setPendingSwap(false)
          onUserInput('')
        }).catch(() => {
          setPendingSwap(false)
          console.log('swap failed')
        })
      }).catch((error) => {
        setPendingSwap(false)
        console.error(`Swap failed`, error)
        throw new Error(`Swap failed`)
      })
    }
  }, [
    bestQuote,
    txData,
    inputCurrencyId,
    outputCurrencyId
  ])

  // const userSlippageTolerance = useUserSlippageTolerance()
  const setUserSlippageTolerance = useSetUserSlippageTolerance()
  const [slippageInput, setSlippageInput] = useState(allowedSlippage.toFixed(1))
  const [slippageError, setSlippageError] = useState<'invalid input' | false>(false)

  function parseSlippageInput(value: string) {

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

  return (
    <div className="flex container max-w-4xl mt-5 mb-10">
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col">
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
        <div className="h-20 flex justify-center items-center">
          <div title="Switch tokens">
            <ArrowDown
              className="cursor-pointer"
              size="24"
              onClick={() => {
                setQuotes({})
                onSwitchTokens()
              }}
              color={'#00bdec'}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex text-sm pl-2">You buy</div>
          <CurrencyInputPanel
            field={Field.OUTPUT}
            value={bestQuote && bestQuote.outputAmountFixed ? bestQuote.outputAmountFixed : '0'}
            onCurrencySelect={handleOutputSelect}
            currency={outputCurrency}
            otherCurrency={inputCurrency}
          />
        </div>

        {canSwap &&
          <div className="flex justify-start my-6 items-center">
            <div className="flex w-44 justify-end mr-5">max slippage</div>
            <div>
              <input
                style={{
                  border: slippageError ? '2px solid red' : '2px solid transparent',
                  backgroundColor: slippageError ? '#ff0000' : '',
                }}
                onChange={(e) => parseSlippageInput(e.target.value)}
                className="w-12 py-1 px-2 text-right"
                value={slippageInput}
              /> %
            </div>
          </div>
        }

        <div className="flex mt-10">
          {insufficientBalance && (
            <div className="dark:text-red-200 text-xl font-bold">Insuffucient balance</div>
          )}
          {needToApprove && (
            <button className="w-full dark:bg-blue-600 text-xl font-bold h-10 px-5" onClick={handleApprove}>Approve MetaRouter</button>
          )}
          {pendingApproval && (
            <div className="w-full flex justify-center items-center dark:bg-blue-800 text-xl font-bold h-10 px-5">
              <span className="mr-4">pending approval</span>
              <Loader stroke="#ffffff"/>
            </div>
          )}
          {canSwap && !pendingSwap && (
            <button className="w-full dark:bg-green-700 text-xl font-bold h-10 px-5" onClick={handleSwap}>Swap</button>
          )}
          {pendingSwap && (
            <div className="w-full justify-center flex items-center dark:bg-blue-800 text-xl font-bold h-10 px-5">
              <span className="mr-4">pending swap</span>
              <Loader stroke="#ffffff"/>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col ml-10">
        <div className="flex text-sm pl-2">Quotes</div>
        <div className="flex flex-col pt-5"></div>
        {quotes && parseFloat(inputValue) > 0 && Object.keys(quotes).map((aggId) => (
          <div key={aggId} className="flex pl-8 py-6 items-center">
            <img src={aggregators[chainId][aggId].logoURI} className="w-12 h-12" alt={aggId} title={aggId} />
            <div className="text-lg pl-4">
              {quotes[aggId]?.outputAmountFixed}
              {quotes[aggId]?.error && (
                <span className="text-sm text-left">{quotes[aggId]?.error}</span>
              )}
            </div>
          </div>
        ) )}
      </div>
    </div>
  )
}

export default Swap