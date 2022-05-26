import { ChainId } from '@/src/enums/ChainId'

export const fee = '0.5'

export const feeReceiver: {[chainId in ChainId]?: string} = {
  [ChainId.POLYGON]: '0x36780E69D38c8b175761c6C5F8eD42E61ee490E9',
}
