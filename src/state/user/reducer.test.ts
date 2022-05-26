import { createStore, Store } from 'redux'

import { updateVersion } from '../global/actions'
import reducer, { initialState, UserState } from './reducer'

export const DEFAULT_DEADLINE_FROM_NOW = 60 * 30

describe('swap reducer', () => {
  let store: Store<UserState>

  beforeEach(() => {
    store = createStore(reducer, initialState)
  })

  describe('updateVersion', () => {
    it('has no timestamp originally', () => {
      expect(store.getState().lastUpdateVersionTimestamp).toBeUndefined()
    })
    it('sets the lastUpdateVersionTimestamp', () => {
      const time = new Date().getTime()
      store.dispatch(updateVersion())
      expect(store.getState().lastUpdateVersionTimestamp).toBeGreaterThanOrEqual(time)
    })
    it('sets allowed slippage and deadline', () => {
      store = createStore(reducer, {
        ...initialState,
        userDeadline: undefined,
        userSlippageTolerance: undefined,
      } as any)
      store.dispatch(updateVersion())
      expect(store.getState().userDeadline).toEqual(DEFAULT_DEADLINE_FROM_NOW)
      expect(store.getState().userSlippageTolerance).toEqual('auto')
    })
  })
})
