import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from '@/src/state/swap/hooks'
import { useChainId } from '@/src/state/network/hooks'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
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

function Swap() {
  console.log('Swap render')
  const chainId = useChainId()
  const { account, library } = useActiveWeb3React()
  // const loadedUrlParams = useDefaultsFromURLSearch(chainId)

  // const [outputAmount, setoutputAmount] = useState<string>('')

  const [quotes, setquotes] = useState<{[id in AggregatorId|string]?: SwapQuote}>({})

  const [allowanceTarget, setAllowanceTarget] = useState<string|undefined>()
  const [pendingApproval, setPendingApproval] = useState<boolean>(false)
  const [txData, setTxData] = useState<TransactionRequest|undefined>(undefined)

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
    // trade: { state: tradeState, trade },
    // allowedSlippage,
    parsedAmount,
    inputCurrency,
    outputCurrency,
    inputBalance,

    // inputError: swapInputError,
  } = useDerivedSwapInfo()

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
            account ?? undefined
          ).then(quote => {
            console.log(`${aggId} reply quote data:`, quote)
            if (!quotes[aggId] || quotes[aggId]?.outputAmountFixed != quote.outputAmountFixed) {
              if (isSubscribed) {
                setquotes(q => ({...q, [aggId]: quote}))
              }
            }
          })
        }
      }
    }

    return () => {isSubscribed = false}
  }, [
    chainId,
    inputCurrency,
    outputCurrency,
    parsedAmount?.quotient.toString()
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

  console.log('Quotes:', quotes)
  console.log('BestQuote:', bestQuote)

  useEffect(() => {
    if (bestQuote && inputCurrency?.isNative === false) {
      aggregators[chainId][bestQuote.protocolId].getAllowanceTarget(bestQuote).then(t => {
        setAllowanceTarget(t)
        console.log('AllowanceTarget:', allowanceTarget)
      })
    }
  }, [chainId, bestQuote])


  // check balance
  const insufficientBalance =
    inputBalance && parsedAmount?.greaterThan(inputBalance)

  // check approval
  const [approval, approveCallback] = useApproval(parsedAmount, allowanceTarget, pendingApproval)
  const needToApprove =
    inputCurrency
    && outputCurrency
    && allowanceTarget
    && parsedAmount
    && !insufficientBalance
    && !pendingApproval
    && !inputCurrency?.isNative
    && approval === ApprovalState.NOT_APPROVED

  console.log('Approval state:', approval)

  // build tx
  useEffect(() => {
    let isSubscribed = true
    const getTxData = async () => {
      if (
        account
        && inputCurrency
        && parsedAmount
        && allowanceTarget
        && outputCurrency
        && inputBalance?.greaterThan(JSBI.BigInt(0))
        && !needToApprove
        && bestQuote
        && !insufficientBalance
      ) {
        const aggId = bestQuote.protocolId
        console.log('Buildtx await')
        const txData =  await aggregators[chainId][aggId].buildTx(
          inputCurrency,
          outputCurrency,
          parsedAmount,
          account,
          allowanceTarget,
          bestQuote
        )
        console.log('Buildtx setTxData')
        if (isSubscribed) {
          setTxData(txData)
        }
      }/* else {
        setTxData(undefined)
      }*/
    }

    getTxData()
    return () => {isSubscribed = false}
  }, [
    chainId,
    inputBalance?.quotient.toString(),
    parsedAmount?.quotient.toString(),
    bestQuote,
    needToApprove,
    allowanceTarget,
    account,
    insufficientBalance
  ])

  console.log('Swap tx:', txData)

  const canSwap =
    inputCurrency
    && outputCurrency
    && !needToApprove
    && !pendingApproval
    && bestQuote
    && !insufficientBalance
    && txData

  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(value)
      // setoutputAmount('')
      setquotes({})
    },
    [onUserInput]
  )

  const handleInputSelect = useCallback(
    (inputCurrency:Currency) => {
      // setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
      setquotes({})
    },
    [onCurrencySelection]
  )

  const handleOutputSelect = useCallback(
    (outputCurrency:Currency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
      setquotes({})
    },
    [onCurrencySelection]
  )

  const handleMaxInput = useCallback(() => {
    if (maxInputAmount) {
      onUserInput(maxInputAmount.toExact())
    }
  }, [maxInputAmount, onUserInput])

  const handleApprove = useCallback(async () => {
    await approveCallback()
  }, [
    approveCallback,
    bestQuote
  ])

  const handleSwap = useCallback(async () => {
    console.log('handle Swap')
    if (library && txData && !needToApprove) {
      library
        .getSigner()
        .sendTransaction(txData)
        .then((response) => {
          console.log(response)
          return response
        })
        .catch((error) => {
          // if the user rejected the tx, pass this along
          if (error?.code === 4001) {
            throw new Error(`Transaction rejected.`)
          } else {
            // otherwise, the error was unexpected and we need to convey that
            console.error(`Swap failed`, error)
            throw new Error(`Swap failed`)
          }
        })
    }
  }, [
    bestQuote,
    txData
  ])

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
        <div className="h-20"></div>
        <div className="flex flex-col">
          <div className="flex text-sm pl-2">You receive</div>
          <CurrencyInputPanel
            field={Field.OUTPUT}
            value={bestQuote && bestQuote.outputAmountFixed ? bestQuote.outputAmountFixed : '0'}
            onCurrencySelect={handleOutputSelect}
            currency={outputCurrency}
            otherCurrency={inputCurrency}
          />
        </div>
        <div className="flex mt-10">
          {insufficientBalance && (
            <div className="dark:text-red-200 text-xl font-bold">Insuffucient balance</div>
          )}
          {needToApprove && (
            <button className="dark:bg-blue-600 text-xl font-bold h-10 px-5" onClick={handleApprove}>Approve {bestQuote?.protocolId} router</button>
          )}
          {canSwap && (
            <button className="dark:bg-green-700 text-xl font-bold h-10 px-5" onClick={handleSwap}>Swap</button>
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