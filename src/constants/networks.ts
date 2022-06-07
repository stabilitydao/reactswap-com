import { ChainId } from '../enums/ChainId'

export const networks: {[chainId: number]: {name: string, rpc: string,}} = {
  [ChainId.POLYGON]: {
    name: 'Polygon',
    rpc: process.env.NEXT_PUBLIC_RPC_POLYGON ?? `https://polygon-rpc.com`,
  },
  /*[ChainId.MUMBAI]: {
    name: 'Mumbai testnet',
    rpc: process.env.NEXT_PUBLIC_RPC_MUMBAI ?? `https://rpc-mumbai.matic.today`,
  }*/
}