import { InjectedConnector } from '@web3-react/injected-connector'
import {networks, rpc} from '@/src/constants/networks'
import {WalletConnectConnector} from "@web3-react/walletconnect-connector";
import {ChainId} from "@/src/enums/ChainId";
export const injected = new InjectedConnector({
  supportedChainIds: Object.keys(networks).map(id => parseInt(id)),
})
export const getWalletConnect = (chainId:ChainId):WalletConnectConnector => new WalletConnectConnector({
  supportedChainIds: Object.keys(networks).map(id => parseInt(id)),
  rpc,
  chainId: chainId,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true
})
