import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { AppState } from '../store'
import { ChainId } from '../../enums/ChainId'
import { networks } from '../../constants/networks'

export interface NetworkState {
  chainId: number
  name: string
}

const initialState: NetworkState = {
  chainId: ChainId.POLYGON,
  name: networks[ChainId.POLYGON].name,
}

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    changeNetwork: (state, action: PayloadAction<ChainId>) => {
      state.chainId = action.payload
      state.name = networks[action.payload].name
    },
  },
})

export const { changeNetwork } = networkSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectChainId = (state: AppState) => state.network.chainId/* || ChainId.POLYGON*/
export const selectNetworkName = (state: AppState) => state.network.name

export default networkSlice.reducer