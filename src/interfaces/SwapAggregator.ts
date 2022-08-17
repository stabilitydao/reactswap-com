import { ChainId } from '@/src/enums/ChainId'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { SwapQuote } from '@/src/types/SwapQuote'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { ProtocolId } from "@/src/enums/ProtocolId";

export interface SwapAggregator {
  id: ProtocolId
  chainId: ChainId
  apiEndpoint: string
  logoURI: string
  getSources(): Promise<[]>
  getAllowanceTarget(swapQuote?: SwapQuote): Promise<string|undefined>
  getQuote(
    token0: Currency,
    token1: Currency,
    amount: CurrencyAmount<Currency>,
    slippage?: number,
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
