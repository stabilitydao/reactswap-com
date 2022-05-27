import { ChainId } from '@/src/enums/ChainId'
import { AggregatorId } from '@/src/enums/AggregatorId'
// import { AmmId } from '@/src/enums/AmmId'

export type SwapQuote = {
  chainId: ChainId
  protocolId: AggregatorId/*|AmmId*/
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