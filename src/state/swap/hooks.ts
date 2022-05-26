import { ParsedQs } from 'qs'
import tryParseCurrencyAmount, { isAddress } from '@/src/utils'
import { inputType, replaceSwapState, selectCurrency, SwapState, switchCurrencies } from '@/src/state/swap/index'
import { TOKEN_SHORTHANDS } from '../../constants/currencies'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState, useAppDispatch } from '@/src/state/store'
import { ReactNode, useCallback, useEffect, useMemo } from 'react'
import useParsedQueryString from '@/src/hooks/useParsedQueryString'
import { Field } from '@/src/state/swap/actions'
import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { useUserSlippageToleranceWithDefault } from '@/src/state/user/hooks'
import useActiveWeb3React from '@/src/hooks/useActiveWeb3React'
import useCurrency from '@/src/hooks/useCurrency'
import { useCurrencyBalances } from '@/src/hooks/useCurrencyBalance'
import { useAllQuotes } from '@/src/hooks/useQuote'
import { useChainId } from '@/src/state/network/hooks'

export function useSwapState(): AppState['swap'] {
  return useSelector<AppState, AppState['swap']>((state) => state.swap)
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(): {
  inputCurrency?: Currency
  outputCurrency?: Currency
  inputBalance?: CurrencyAmount<Currency>
  outputBalance?: CurrencyAmount<Currency>
  // currencies: { [field in Field]?: Currency | null }
  // currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  parsedAmount?: CurrencyAmount<Currency>
  // inputError?: ReactNode
  /*trade: {
    trade: InterfaceTrade<Currency, Currency, TradeType> | undefined
    state: TradeState
  }*/
  allowedSlippage: Percent

  // outputAmount?: string
} {
  const { account } = useActiveWeb3React()

  const {
    inputValue,
    inputCurrencyId,
    outputCurrencyId,
  } = useSwapState()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const relevantTokenBalances = useCurrencyBalances(
    account ?? undefined,
    [
      inputCurrency ?? undefined,
      outputCurrency ?? undefined,
    ]
  )

  const parsedAmount = tryParseCurrencyAmount(inputValue, inputCurrency ?? undefined)

  /*

  /*const trade = useBestTrade(
    isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    parsedAmount,
    (isExactIn ? outputCurrency : inputCurrency) ?? undefined
  )*/

  const currencyBalances = useMemo(
    () => ({
      [Field.INPUT]: relevantTokenBalances[0],
      [Field.OUTPUT]: relevantTokenBalances[1],
    }),
    [relevantTokenBalances]
  )

  /*const currencies: { [field in Field]?: Currency | null } = useMemo(
    () => ({
      [Field.INPUT]: inputCurrency,
      [Field.OUTPUT]: outputCurrency,
    }),
    [inputCurrency, outputCurrency]
  )*/

  // allowed slippage is either default or custom user defined slippage
  const allowedSlippage = new Percent(50, 10_000)// useUserSlippageToleranceWithDefault(new Percent(50, 10_000)) // .50%

  /*
  const inputError = useMemo(() => {
    let inputError: string | undefined

    if (!account) {
      inputError = 'Connect Wallet'
    }

    if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
      inputError = inputError ?? 'Select a token'
    }

    if (!parsedAmount) {
      inputError = inputError ?? 'Enter an amount'
    }

    // compare input balance to max input based on version
    const [balanceIn, amountIn] = [currencyBalances[Field.INPUT], trade.trade?.maximumAmountIn(allowedSlippage)]

    if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
      inputError = `Insufficient ${amountIn.currency.symbol} balance`
    }

    return inputError
  }, [account, allowedSlippage, currencies, currencyBalances, parsedAmount, to, trade.trade])
*/

  // console.log('useDerivedSwapInfo')
  return useMemo(
    () => ({
      inputCurrency,
      outputCurrency,
      inputBalance: relevantTokenBalances[0],
      outputBalance: relevantTokenBalances[1],
      parsedAmount,
      // inputError,
      // trade,
      allowedSlippage,
      // outputAmount,
    }),
    [allowedSlippage, inputCurrency, outputCurrency, inputValue]
  )
}

function parseCurrencyFromURLParameter(urlParam: any): string {
  if (typeof urlParam === 'string') {
    const valid = isAddress(urlParam)
    if (valid) return valid
    const upper = urlParam.toUpperCase()
    if (upper === 'ETH' || upper === 'NATIVE') {
      return 'ETH'
    }
    if (upper in TOKEN_SHORTHANDS) return upper
  }
  return ''
}

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam)) ? urlParam : ''
}

export function queryParametersToSwapState(parsedQs: ParsedQs): SwapState {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency)
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency)
  const inputValue = parseTokenAmountURLParameter(parsedQs.exactAmount)

  if (inputCurrency === '' && outputCurrency === '' && inputValue === '') {
    // Defaults to having the native currency selected
    inputCurrency = 'ETH'
  } else if (inputCurrency === outputCurrency) {
    // clear output if identical
    outputCurrency = ''
  }

  return {
    inputCurrencyId: inputCurrency,
    outputCurrencyId: outputCurrency,
    inputValue,
  }
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch(chainId: number): SwapState {
  const dispatch = useDispatch<AppDispatch>()
  const parsedQs = useParsedQueryString()

  const parsedSwapState = useMemo(() => {
    return queryParametersToSwapState(parsedQs)
  }, [parsedQs])

  useEffect(() => {
    if (!chainId) return
    const inputCurrency = parsedSwapState.inputCurrencyId ?? undefined
    const outputCurrency = parsedSwapState.outputCurrencyId ?? undefined

    dispatch(
      replaceSwapState({
        inputValue: parsedSwapState.inputValue,
        inputCurrency,
        outputCurrency,
      })
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId])

  return parsedSwapState
}

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: () => void
  onUserInput: (typedValue: string) => void
} {
  const dispatch = useAppDispatch()
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency.isToken ? currency.address : currency.isNative ? 'ETH' : '',
        })
      )
    },
    [dispatch]
  )

  const onSwitchTokens = () => dispatch(switchCurrencies())

  const onUserInput = (typedValue: string) => {
    dispatch(inputType(typedValue))
  }

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput
  }
}