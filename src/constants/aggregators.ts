import {ChainId} from '@/src/enums/ChainId'
import {SwapAggregator} from '@/src/interfaces/SwapAggregator'
import {OneInch} from '@/src/agg/OneInch'
import {ZeroX} from '@/src/agg/ZeroX'
import {OpenOcean} from '@/src/agg/OpenOcean'
import {ProtocolId} from "@/src/enums/ProtocolId";
import {protocols} from "@/src/constants/protocols";

export const aggregators: {
    [chainId in ChainId | number]: {
        [aggId in ProtocolId | number]?: SwapAggregator
    }
} = {
    [ChainId.POLYGON]: {
        [ProtocolId.oneinch]: new OneInch(
            ChainId.POLYGON,
            'https://api.1inch.io/v4.0/137/',
            protocols[ProtocolId.oneinch].img,
        ),
        [ProtocolId.zerox]: new ZeroX(
            ChainId.POLYGON,
            'https://polygon.api.0x.org/swap/v1/',
            protocols[ProtocolId.zerox].img,
        ),
        [ProtocolId.openocean]: new OpenOcean(
            ChainId.POLYGON,
            'https://open-api.openocean.finance/v3/polygon/',
            protocols[ProtocolId.openocean].img,
        )
    },
}

export const sourceMappingOneInch: {
    [chainId in ChainId]: {
        [id: string]: ProtocolId
    }
} = {
    [ChainId.POLYGON]: {
        POLYGON_QUICKSWAP: ProtocolId.quickswap,
        POLYGON_CURVE: ProtocolId.curve,
        POLYGON_SUSHISWAP: ProtocolId.sushiswap,
        POLYGON_AAVE_V2: ProtocolId.aavev2,
        COMETH: ProtocolId.cometh,
        DFYN: ProtocolId.dfyn,
        POLYGON_MSTABLE: ProtocolId.mstable,
        FIREBIRD_FINANCE: ProtocolId.firebird,
        ONESWAP: ProtocolId.oneswap,
        POLYDEX_FINANCE: ProtocolId.polydex,
        POLYGON_ONE_INCH_LIMIT_ORDER: ProtocolId.oneinchlimitorder,
        POLYGON_ONE_INCH_LIMIT_ORDER_V2: ProtocolId.oneinchlimitorderv2,
        POLYGON_WAULTSWAP: ProtocolId.wault,
        POLYGON_BALANCER_V2: ProtocolId.balancerv2,
        POLYGON_KYBER_DMM: ProtocolId.kyberdmm,
        POLYGON_DODO: ProtocolId.dodo,
        POLYGON_DODO_V2: ProtocolId.dodov2,
        POLYGON_JETSWAP: ProtocolId.jetswap,
        IRONSWAP: ProtocolId.ironswap,
        POLYGON_UNIFI: ProtocolId.unifi,
        POLYGON_DFX_FINANCE: ProtocolId.dfx,
        POLYGON_APESWAP: ProtocolId.apeswap,
        POLYGON_SAFE_SWAP: ProtocolId.safeswap,
        POLYCAT_FINANCE: ProtocolId.polycat,
        POLYGON_CURVE_V2: ProtocolId.curvev2,
        POLYGON_UNISWAP_V3: ProtocolId.uniswapv3,
        POLYGON_ELK: ProtocolId.elk,
        POLYGON_SYNAPSE: ProtocolId.synapse,
        POLYGON_ALGEBRA_FINANCE: ProtocolId.algebra,
        POLYGON_GRAVITY: ProtocolId.gravity,
        POLYGON_NERVE: ProtocolId.nerve,
        POLYGON_DYSTOPIA: ProtocolId.dystopia,
        POLYGON_RADIOSHACK: ProtocolId.radioshack,
        POLYGON_MESHSWAP: ProtocolId.meshswap,
        POLYGON_KYBERSWAP_ELASTIC: ProtocolId.kyberswapelastic,
        POLYGON_WOOFI: ProtocolId.woofi,
        POLYGON_MAVERICK: ProtocolId.maverick,
    },
}

export const sourceMappingZeroX: {
    [chainId in ChainId]: {
        [id: string]: ProtocolId
    }
} = {
    [ChainId.POLYGON]: {
        SushiSwap: ProtocolId.sushiswap,
        Curve: ProtocolId.curve,
        Curve_V2: ProtocolId.curvev2,
        Uniswap_V3: ProtocolId.uniswapv3,
        Aave_V2: ProtocolId.aavev2,
        ApeSwap: ProtocolId.apeswap,
        Balancer_V2: ProtocolId.balancerv2,
        ComethSwap: ProtocolId.cometh,
        Dfyn: ProtocolId.dfyn,
        DODO: ProtocolId.dodo,
        DODO_V2: ProtocolId.dodov2,
        FirebirdOneSwap: ProtocolId.oneswap,
        IronSwap: ProtocolId.ironswap,
        JetSwap: ProtocolId.jetswap,
        KyberDMM: ProtocolId.kyberdmm,
        // LiquidityProvider: undefined,
        MeshSwap: ProtocolId.meshswap,
        mStable: ProtocolId.mstable,
        Polydex: ProtocolId.polydex,
        QuickSwap: ProtocolId.quickswap,
        Synapse: ProtocolId.synapse,
        WaultSwap: ProtocolId.wault,
    },
}

export const sourceMappingOpenOcean: {
    [chainId in ChainId]: {
        [id: string]: ProtocolId
    }
} = {
    [ChainId.POLYGON]: {
        Quickswap: ProtocolId.quickswap,
        Cometh: ProtocolId.cometh,
        PolyZap: ProtocolId.polyzap,
        Curve: ProtocolId.curve,
        Apeswap: ProtocolId.apeswap,
        Waultswap: ProtocolId.wault,
        KyberSwap: ProtocolId.kyberdmm,
        JetSwap: ProtocolId.jetswap,
        BalancerV2: ProtocolId.balancerv2,
        Synapse: ProtocolId.synapse,
        PolyCat: ProtocolId.polycat,
        PolyDex: ProtocolId.polydex,
        UniswapV3: ProtocolId.uniswapv3,
        ClipperRFQ: ProtocolId.oneinchlimitorderv2,
        AaveV2: ProtocolId.aavev2,
        DODOv2: ProtocolId.dodov2,
        Gravity: ProtocolId.gravity,
        DFX: ProtocolId.dfx,
        Dfyn: ProtocolId.dfyn,
        SushiSwap: ProtocolId.sushiswap,
        //PMM1
        MeshSwap: ProtocolId.meshswap,
        Dystopia: ProtocolId.dystopia,
        WOOFi: ProtocolId.woofi,
        ClipperCove: ProtocolId.oneinchlimitorder,
    }
}
