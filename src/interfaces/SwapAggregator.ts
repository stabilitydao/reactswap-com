import { AggregatorId } from '@/src/enums/AggregatorId'
import { ChainId } from '@/src/enums/ChainId'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { SwapQuote } from '@/src/types/SwapQuote'
import { TransactionRequest } from '@ethersproject/abstract-provider'

export interface SwapAggregator {
  id: AggregatorId
  chainId: ChainId
  apiEndpoint: string
  logoURI: string
  getSources(): Promise<[]>
  getAllowanceTarget(swapQuote?: SwapQuote): Promise<string|undefined>
  getQuote(
    token0: Currency,
    token1: Currency,
    amount: CurrencyAmount<Currency>,
    from?: string
  ): Promise<SwapQuote>;
  buildTx(
    token0: Currency,
    token1: Currency,
    amount: CurrencyAmount<Currency>,
    from: string,
    to?: string,
    swapQuote?: SwapQuote,
    slippage?: number,
    gasLimit?: string
  ): Promise<TransactionRequest|undefined>
}
