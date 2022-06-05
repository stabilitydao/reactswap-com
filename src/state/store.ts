import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import network from './network'
import swap from './swap'
import lists from './lists/reducer'
import block from './block'
import multicall from './multicall/reducer'
import user from './user/reducer'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { load, save } from 'redux-localstorage-simple'
import { setupListeners } from '@reduxjs/toolkit/query'
import { updateVersion } from '@/src/state/global/actions'

const PERSISTED_KEYS: string[] = ['user', 'lists']

const store = configureStore({
  reducer: {
    network,
    swap,
    lists,
    block,
    multicall,
    user,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true })
      .concat(save({ states: PERSISTED_KEYS, debounce: 1000 })),
  preloadedState: load({ states: PERSISTED_KEYS, disableWarnings: process.env.NODE_ENV === 'test' }),
})

store.dispatch(updateVersion())

setupListeners(store.dispatch)

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