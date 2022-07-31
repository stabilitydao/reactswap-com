import axios from 'axios'
import { ChainId } from '@/src/enums/ChainId'

export const chainIdMapping: {[chainId in ChainId]: string} = {
  [ChainId.POLYGON]: "polygon",
}

export interface Pair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    symbol: string;
  };
  priceNative: string;
  priceUsd?: string;
  txns: {
    m5: {
      buys: number;
      sells: number;
    };
    h1: {
      buys: number;
      sells: number;
    };
    h6: {
      buys: number;
      sells: number;
    };
    h24: {
      buys: number;
      sells: number;
    };
  };
  volume: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity?: {
    usd?: number;
    base: number;
    quote: number;
  };
  fdv?: number;
  pairCreatedAt?: number;
}

interface PairsResponse {
  schemaVersion: string;
  /** @deprecated use pairs field instead */
  pair: Pair | null;
  pairs: Pair[] | null;
}

interface TokensResponse {
  schemaVersion: string;
  pairs: Pair[] | null;
}

export class DexScreener {
  apiEndpoint: string = 'https://api.dexscreener.io/latest/dex/'

  async getTokens(tokens: string[]): Promise<TokensResponse|undefined> {
    const url = `${this.apiEndpoint}tokens/${tokens.join(',')}`
    try {
      const { data }: any = await axios({
        url,
      })

      console.log(`DexScreener quote reply raw data:`, data)

      return data
    }  catch (error: any) {
      console.log('Catched error: ', error)
    }

    return undefined
  }
}