import { useDispatch, useSelector } from 'react-redux'
import useSWR from 'swr'
import { setBlock } from './index'
import { AppDispatch, AppState, useAppSelector } from '@/src/state/store'
import { useChainId } from '../network/hooks'
import { getRpcProvider } from '../../utils/rpc'

const REFRESH_BLOCK_INTERVAL = 10000
export const FAST_INTERVAL = 100000
export const SLOW_INTERVAL = 60000

export const usePollBlockNumber = () => {
  const chainId = useChainId()
  const simpleRpcProvider = getRpcProvider(chainId)
  const dispatch = useDispatch<AppDispatch>()

  const { data } = useSWR(
    ['blockNumber'],
    async () => {
      const blockNumber = await simpleRpcProvider.getBlockNumber()
      dispatch(setBlock(blockNumber))
      return blockNumber
    },
    {
      refreshInterval: REFRESH_BLOCK_INTERVAL,
    },
  )

  useSWR(
    [FAST_INTERVAL, 'blockNumber'],
    async () => {
      return data
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  useSWR(
    [SLOW_INTERVAL, 'blockNumber'],
    async () => {
      return data
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )
}

export const useBlock = () => {
  return useSelector((state: AppState) => state.block)
}

export const useCurrentBlock = () => {
  return useAppSelector((state) => state.block.currentBlock)
}

export const useInitialBlock = () => {
  return useSelector((state: AppState) => state.block.initialBlock)
}
