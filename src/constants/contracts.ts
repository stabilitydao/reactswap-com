import { ChainId } from '@/src/enums/ChainId'

export const multicall: {[chainId in ChainId]?: string} = {
  [ChainId.POLYGON]: '0x275617327c958bD06b5D6b871E7f491D76113dd8',
}

export const metarouter: {[chainId in ChainId]: string} = {
  [ChainId.POLYGON]: '0xa3B6Ad2A14Cfc87D370328C038E2496215eC6E9F',
}
