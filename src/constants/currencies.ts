import { ChainId } from '@/src/enums/ChainId'
import { Currency, NativeCurrency, Token } from '@uniswap/sdk-core'
import { Native } from '@/src/entities/Native'

export const wrappedNative: {[chainId in ChainId|number]: Token} = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', 18, 'WMATIC', 'Wrapped Matic'),
}

export const native: {[chainId in ChainId|number]: NativeCurrency } = {
  [ChainId.POLYGON]: new Native(ChainId.POLYGON, 18, 'MATIC', 'Matic', wrappedNative[ChainId.POLYGON]),
}

export const DAI = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 18, 'DAI', '(PoS) Dai Stablecoin')
}

export const WBTC = {
  [ChainId.POLYGON]: new Token(ChainId.POLYGON, '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', 8, 'WBTC', '(PoS) Wrapped BTC'),
}

export const bases: {[chainId in ChainId|number]: Currency[]} = {
  [ChainId.POLYGON]: [
    native[ChainId.POLYGON],
    wrappedNative[ChainId.POLYGON],
    new Token(ChainId.POLYGON, '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', 18, 'WETH', 'Wrapped Ether'),
    WBTC[ChainId.POLYGON],
    new Token(ChainId.POLYGON, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USD Coin'),
    new Token(ChainId.POLYGON, '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', 6, 'USDT', '(PoS) Tether USD'),
    DAI[ChainId.POLYGON],
  ],
}

export function nativeOnChain(chainId: ChainId): NativeCurrency {
  return native[chainId]
}


export const TOKEN_SHORTHANDS: { [shorthand: string]: { [chainId: number]: string } } = {
  DAI: {
    [ChainId.POLYGON]: DAI[ChainId.POLYGON].address,
  },
  WBTC: {
    [ChainId.POLYGON]: WBTC[ChainId.POLYGON].address,
  }
}
