import { ChainId } from '@/src/enums/ChainId'

export const fee = '0.5'

export const feeReceiver: {[chainId in ChainId]?: string} = {
  [ChainId.POLYGON]:  '0x005d71553aD3f8f919E5121aA45Bf24594DCE0d6',
}
