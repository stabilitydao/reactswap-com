import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { queryParametersToSwapState } from './hooks'
import { parsedQueryString } from '@/src/hooks/useParsedQueryString'
import { Field } from '@/src/state/swap/actions'
import { AppState } from '@/src/state/store'

export interface SwapState {
  inputValue: string | any
  inputCurrencyId: string | undefined
  outputCurrencyId: string | undefined
}

const initialState: SwapState = queryParametersToSwapState(parsedQueryString())

export const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    selectCurrency: (state, {payload: {field, currencyId},}) => {
      console.log('selectCurrency')
      if (field == Field.INPUT) {
        state.inputCurrencyId = currencyId
      } else {
        state.outputCurrencyId = currencyId
      }
    },
    inputType: (state, {payload,}) => {
      state.inputValue = payload
    },
    replaceSwapState: (state, {payload: {inputValue, inputCurrency, outputCurrency},}) => {
      state.inputValue = inputValue
      state.inputCurrencyId = inputCurrency
      state.outputCurrencyId = outputCurrency
    },
    switchCurrencies: (state) => {
      state = {
        inputCurrencyId: state.outputCurrencyId,
        outputCurrencyId: state.inputCurrencyId,
        inputValue: state.inputValue,
      }
    },
  },
})

export const { selectCurrency, switchCurrencies, inputType, replaceSwapState } = swapSlice.actions

export default swapSlice.reducer