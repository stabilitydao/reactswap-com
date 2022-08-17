import {ProtocolId} from "@/src/enums/ProtocolId";
import {Protocol} from "@/src/types/Protocol";

/**
 * DeFi protocols with logos
 */
export const protocols: {
    [id in ProtocolId]: Protocol
} = {
    [ProtocolId.oneinch]: {
        title: '1Inch',
        img: '/img/1inch.webp',
    },
    [ProtocolId.zerox]: {
        title: '0x',
        img: '/img/0x.webp',
    },
    [ProtocolId.openocean]: {
        title: 'Open Ocean',
        img: '/img/openocean.png',
    },
    [ProtocolId.uniswapv3]: {
        title: 'Uniswap V3',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/uniswap_color.png',
    },
    [ProtocolId.sushiswap]: {
        title: 'SushiSwap',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/sushiswap_color.png',
    },
    [ProtocolId.quickswap]: {
        title: 'Quick Swap',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/quickswap_color.png',
    },
    [ProtocolId.curve]: {
        title: 'Curve',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/curve_color.png',
    },
    [ProtocolId.curvev2]: {
        title: 'Curve V2',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/curve_color.png',
    },
    [ProtocolId.aavev2]: {
        title: 'Aave V2',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/aave_color.png',
    },
    [ProtocolId.cometh]: {
        title: 'Cometh',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/cometh_color.png',
    },
    [ProtocolId.dfyn]: {
        title: 'Dfyn',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/dfyn_color.png',
    },
    [ProtocolId.mstable]: {
        title: 'mStable',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/mstable_color.png',
    },
    [ProtocolId.firebird]: {
        title: 'Firebird',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/firebird_color.png',
    },
    [ProtocolId.oneswap]: {
        title: 'Firebird OneSwap',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/firebird_color.png',
    },
    [ProtocolId.polydex]: {
        title: 'Polydex',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/polydex_color.png',
    },
    [ProtocolId.oneinchlimitorder]: {
        title: '1inch Limit Order Protocol',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/1inch_color.png',
    },
    [ProtocolId.oneinchlimitorderv2]: {
        title: '1inch Limit Order Protocol V2',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/1inch_color.png',
    },
    [ProtocolId.wault]: {
        title: 'Wault Swap',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/waultswap_color.png',
    },
    [ProtocolId.balancerv2]: {
        title: 'Balancer V2',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/balancer_color.png',
    },
    [ProtocolId.kyberdmm]: {
        title: 'Kyber DMM',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/kyber_color.png',
    },
    [ProtocolId.dodo]: {
        title: 'DODO',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/dodo_color.png',
    },
    [ProtocolId.dodov2]: {
        title: 'DODO V2',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/dodo_color.png',
    },
    [ProtocolId.jetswap]: {
        title: 'JetSwap',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/jetswap_color.png',
    },
    [ProtocolId.ironswap]: {
        title: 'IronSwap',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/ironswap_color.png',
    },
    [ProtocolId.unifi]: {
        title: 'Unifi',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/unifi_color.png',
    },
    [ProtocolId.dfx]: {
        title: 'DFX Finance',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/dfx_color.png',
    },
    [ProtocolId.apeswap]: {
        title: 'ApeSwap',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/apeswap_color.png',
    },
    [ProtocolId.safeswap]: {
        title: 'SafeSwap',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/safeswap_color.png',
    },
    [ProtocolId.polycat]: {
        title: 'Polycat',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/polycat_color.png',
    },
    [ProtocolId.elk]: {
        title: 'ELK',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/elk_color.png',
    },
    [ProtocolId.synapse]: {
        title: 'Synapse',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/synapse_color.png',
    },
    [ProtocolId.algebra]: {
        title: 'Algebra',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/algebra_finance_color.png',
    },
    [ProtocolId.gravity]: {
        title: 'Gravity',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/gravity_color.png',
    },
    [ProtocolId.nerve]: {
        title: 'Nerve',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/nerve_color.png',
    },
    [ProtocolId.dystopia]: {
        title: 'Dystopia',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/dystopia_color.png',
    },
    [ProtocolId.radioshack]: {
        title: 'RadioShack',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/radioshack_color.png',
    },
    [ProtocolId.meshswap]: {
        title: 'MeshSwap',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/meshswap_color.png',
    },
    [ProtocolId.kyberswapelastic]: {
        title: 'KyberSwap Elastic',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/kyber_color.png',
    },
    [ProtocolId.woofi]: {
        title: 'Woofi',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/woofi_color.png',
    },
    [ProtocolId.maverick]: {
        title: 'Maverick',
        img: 'https://cdn.1inch.io/liquidity-sources-logo/maverick_color.png',
    },
    [ProtocolId.polyzap]: {
        title: 'PolyZap Finance',
        img: 'https://assets.coingecko.com/coins/images/15623/small/polyzap.png',
    }
}