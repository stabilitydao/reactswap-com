import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface BlockState {
  currentBlock: number
  initialBlock: number
}

const initialState: BlockState = { currentBlock: 0, initialBlock: 0 }

export const blockSlice = createSlice({
  name: 'Block',
  initialState,
  reducers: {
    setBlock: (state, action: PayloadAction<number>) => {
      if (state.initialBlock === 0) {
        state.initialBlock = action.payload
      }

      state.currentBlock = action.payload
    },
  },
})

// Actions
export const { setBlock } = blockSlice.actions

export default blockSlice.reducer
