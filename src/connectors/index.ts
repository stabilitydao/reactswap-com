import { InjectedConnector } from '@web3-react/injected-connector'
import { networks } from '@/src/constants/networks'
export const injected = new InjectedConnector({
  supportedChainIds: Object.keys(networks).map(id => parseInt(id)),
})
