import { ChainId } from '@/src/enums/ChainId'
import { SwapAggregator } from '@/src/interfaces/SwapAggregator'
import { AggregatorId } from '@/src/enums/AggregatorId'
import { OneInch } from '@/src/agg/OneInch'
import { ZeroX } from '@/src/agg/ZeroX'

export const aggregators: {[chainId in ChainId|number]: {
  [aggId in AggregatorId|string]: SwapAggregator}
} = {
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

export const sourceMappingZeroXOneInch: {[chainId in ChainId]: {
  [id:string]: string
}} = {
  [ChainId.POLYGON]: {
    SushiSwap: "POLYGON_SUSHISWAP",
    Curve: "POLYGON_CURVE",
    Curve_V2: "POLYGON_CURVE_V2",
    Uniswap_V3: "POLYGON_UNISWAP_V3",
    Aave_V2: "POLYGON_AAVE_V2",
    ApeSwap: "POLYGON_APESWAP",
    Balancer_V2: "POLYGON_BALANCER_V2",
    ComethSwap: "COMETH",
    Dfyn: "DFYN",
    DODO: "POLYGON_DODO",
    DODO_V2: "POLYGON_DODO_V2",
    FirebirdOneSwap: "FIREBIRD_FINANCE",
    IronSwap: "IRONSWAP",
    JetSwap: "POLYGON_JETSWAP",
    KyberDMM: "POLYGON_KYBER_DMM",
    // LiquidityProvider: undefined,
    // MeshSwap: undefined,
    mStable: "POLYGON_MSTABLE",
    // MultiHop: undefined,
    Polydex: "POLYDEX_FINANCE",
    QuickSwap: "POLYGON_QUICKSWAP",
    Synapse: "POLYGON_SYNAPSE",
    WaultSwap: "POLYGON_WAULTSWAP",
  },
}