import { ChainId } from '../enums/ChainId'

export const networks: {[chainId: number]: {
    name: string,
    rpc: string,
    logo?: string,
    bg?: string,
    darkBg?: string,
  }} = {
  [ChainId.POLYGON]: {
    name: 'Polygon',
    rpc: process.env.NEXT_PUBLIC_RPC_POLYGON ?? `https://polygon-rpc.com`,
    logo: '/img/polygon.png',
    darkBg: '#361b5c',
  },
  /*[ChainId.MUMBAI]: {
    name: 'Mumbai testnet',
    rpc: process.env.NEXT_PUBLIC_RPC_MUMBAI ?? `https://rpc-mumbai.matic.today`,
  }*/
}