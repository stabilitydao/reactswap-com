import { createSlice } from '@reduxjs/toolkit'
import { Field } from '@/src/state/swap/actions'

export interface SwapState {
  inputValue: string | any
  inputCurrencyId: string | undefined
  outputCurrencyId: string | undefined
}

const initialState: SwapState = {
  inputCurrencyId: '',
  outputCurrencyId: '',
  inputValue: ''
}

export const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    selectCurrency: (state, {payload: {field, currencyId},}) => {
      // console.log('selectCurrency')
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
      const oldInputCurrency = state.inputCurrencyId
      state.inputCurrencyId = state.outputCurrencyId
      state.outputCurrencyId = oldInputCurrency
      state.inputValue = ''
    },
  },
})

export const { selectCurrency, switchCurrencies, inputType, replaceSwapState } = swapSlice.actions

export default swapSlice.reducer