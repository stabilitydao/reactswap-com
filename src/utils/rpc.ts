import { ethers } from 'ethers'
import { networks } from '@/src/constants/networks'
import { ChainId } from '@/src/enums/ChainId'

export const getRpcProvider = (chainId: ChainId) => {
  const rpc = networks[chainId].rpc
  return new ethers.providers.StaticJsonRpcProvider(rpc)
}
