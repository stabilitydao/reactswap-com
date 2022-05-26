import { ChainId } from '@/src/enums/ChainId'
import { SwapAggregator } from '@/src/interfaces/SwapAggregator'
import { AggregatorId } from '@/src/enums/AggregatorId'
import { OneInch } from '@/src/agg/OneInch'
import { ZeroX } from '@/src/agg/ZeroX'

export const aggregators: {[chainId in ChainId|number]: {[aggId in AggregatorId|string]: SwapAggregator}} = {
  [ChainId.POLYGON]: {
    [AggregatorId.OneInch]: new OneInch(
      ChainId.POLYGON,
      'https://api.1inch.io/v4.0/137/',
      '/img/1inch.webp'
    ),
    [AggregatorId.ZeroX]: new ZeroX(
      ChainId.POLYGON,
      'https://polygon.api.0x.org/swap/v1/',
      '/img/0x.webp'
    )
  },
}