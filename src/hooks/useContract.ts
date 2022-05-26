import { Contract } from '@ethersproject/contracts'
import { useMemo } from 'react'
import useActiveWeb3React from '@/src/hooks/useActiveWeb3React'
import { getContract } from '@/src/utils'
import ERC20_ABI from '@/src/abis/erc20.json'
import ERC20_BYTES32_ABI from '@/src/abis/erc20_bytes32.json'
import MULTICALL_ABI from '@/src/abis/multicall.json'
import { Erc20, Multicall } from '@/src/abis/types'
import { useChainId } from '@/src/state/network/hooks'
import { multicall } from '@/src/constants/contracts'

// returns null on errors
function useContract<T extends Contract = Contract>(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true,
): T | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account]) as T
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function useMulticallContract() {
  const chainId = useChainId()
  const multicallAddress = multicall[chainId]
  return useContract<Multicall>(multicallAddress, MULTICALL_ABI, false)
}
