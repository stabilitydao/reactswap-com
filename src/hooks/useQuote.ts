import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { aggregators } from '@/src/constants/aggregators'
import { AggregatorId } from '@/src/enums/AggregatorId'
import { AmmId } from '@/src/enums/AmmId'
import { ChainId } from '@/src/enums/ChainId'
import { SwapQuote } from '@/src/types/SwapQuote'
import JSBI from 'jsbi'

export function useAllQuotes(
  chainId: ChainId,
  inputCurrency?: Currency,
  outputCurrency?: Currency,
  inputAmount?: CurrencyAmount<Currency>
): {
  quotes: {[id in AggregatorId|AmmId]?: {}|SwapQuote},
  outputAmount?: string,
  bestQuoteProtocolId?: AggregatorId|AmmId,
} {
  const quotes: {[id in AggregatorId|AmmId]?: {}} = {}
  let bestQuoteProtocolId: undefined|AggregatorId|AmmId
  let outputAmount: string|undefined

  console.log('useAllQuotes inputCurrency', inputCurrency)
  console.log('useAllQuotes outputCurrency', outputCurrency)
  console.log('useAllQuotes inputAmount', inputAmount)

  if (inputCurrency && outputCurrency && inputAmount) {
    if (aggregators[chainId][AggregatorId.ZeroX]) {
      quotes[AggregatorId.ZeroX] = aggregators[chainId][AggregatorId.ZeroX].getQuote(
        inputCurrency,
        outputCurrency,
        inputAmount
      )
    }
  }

  return {
    quotes,
    bestQuoteProtocolId,
    outputAmount,
  }
}