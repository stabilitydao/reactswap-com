import axios, {AxiosResponse} from 'axios'
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
  apiEndpoint = 'https://api.dexscreener.io/latest/dex/'

  async tokens(tokenAddresses: string[]): Promise<TokensResponse|undefined> {
    const url = `${this.apiEndpoint}tokens/${tokenAddresses.join(',')}`
    try {
      const { data }: AxiosResponse = await axios({
        url,
      })

      console.log(`DexScreener tokens reply raw data:`, data)

      return data
    }  catch (error) {
      console.log('Caught error: ', error)
    }

    return undefined
  }

  // query E.g.: WBTC or WBTC/USDC or 0xAbc01
  async search(query: string): Promise<PairsResponse|undefined> {
    const url = `${this.apiEndpoint}search/?q=${query}`
    try {
      const { data }: AxiosResponse = await axios({
        url,
      })

      console.log(`DexScreener search reply raw data:`, data)

      return data
    }  catch (error) {
      console.log('Caught error: ', error)
    }

    return undefined
  }
}