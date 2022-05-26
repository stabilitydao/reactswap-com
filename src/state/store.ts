import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import network from './network'
import swap from './swap'
import lists from './lists/reducer'
import block from './block'
import multicall from './multicall/reducer'
import user from './user/reducer'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export function makeStore() {
  return configureStore({
    reducer: {
      network,
      swap,
      lists,
      block,
      multicall,
      user,
    },
  })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
  >

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

export default store