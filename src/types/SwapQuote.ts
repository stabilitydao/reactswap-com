import { ChainId } from '@/src/enums/ChainId'
import {ProtocolId} from "@/src/enums/ProtocolId";

export type SwapQuote = {
  chainId: ChainId
  protocolId: ProtocolId
  inputCurrencyId: string
  inputAmount: string
  outputCurrencyId: string
  outputAmount?: string
  outputAmountFixed?: string
  error?: string
  price?: string
  guaranteedPrice?: string
  to?: string
  value?: number
  allowanceTarget?: string
  data?: string
  estimatedGas?: number
  gas?: number,
  gasPrice?: number,
  sources?: any
  routing?: any
}