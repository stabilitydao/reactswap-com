import { SwapAggregator } from '@/src/interfaces/SwapAggregator'
import { AggregatorId } from '@/src/enums/AggregatorId'
import { ChainId } from '@/src/enums/ChainId'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import axios from "axios";
import { SwapQuote } from '@/src/types/SwapQuote'
import { TransactionRequest } from '@ethersproject/abstract-provider'

export class ZeroX implements SwapAggregator {
  id: AggregatorId = AggregatorId.ZeroX
  chainId: ChainId
  apiEndpoint: string
  logoURI: string

  public constructor(chainId: ChainId, apiEndpoint: string, logoURI: string) {
    this.chainId = chainId
    this.apiEndpoint = apiEndpoint
    this.logoURI = logoURI
  }

  async getAllowanceTarget(swapQuote?: SwapQuote): Promise<string|undefined> {
    return swapQuote?.allowanceTarget
  }

  async getQuote(token0: Currency, token1: Currency, amount: CurrencyAmount<Currency>, slippage?: number, from?: string): Promise<SwapQuote> {
    const params = {
      sellToken: token0.isToken ? token0.address : token0.symbol,
      buyToken: token1.isToken ? token1.address : token1.symbol,
      sellAmount: amount.quotient.toString(),
      slippagePercentage: slippage ? (slippage / 100) : 0.03,
      // ...(from ? {takerAddress: from,} : {}),
    }

    const url = `${this.apiEndpoint}quote`

    try {
      const { data }: any = await axios({
        url,
        params,
      })
      // console.log(`${this.id} quote reply raw data:`, data)

      return {
        chainId: this.chainId,
        protocolId: this.id,
        inputCurrencyId: data.sellTokenAddress,
        inputAmount: data.sellAmount,
        outputCurrencyId: data.buyTokenAddress,
        outputAmount: data.buyAmount,
        outputAmountFixed: CurrencyAmount.fromRawAmount(token1, data.buyAmount).toFixed(6),
        price: data.price,
        to: data.to,
        data: data.data,
        value: data.value,
        estimatedGas: data.estimatedGas,
        gas: data.gas,
        gasPrice: data.gasPrice,
        sources: data.orders,
        allowanceTarget: data.allowanceTarget,
      }
    } catch (error) {
      console.log(error)
      throw new Error(JSON.stringify(error));
    }
  }

  async buildTx(
    token0: Currency,
    token1: Currency,
    amount: CurrencyAmount<Currency>,
    from: string,
    to?: string,
    swapQuote?: SwapQuote,
    slippage?: number,
    gasLimit?: string
  ): Promise<TransactionRequest|undefined> {
    if (!swapQuote) {
      return undefined
    }

    return {
      to: swapQuote.to, // whitelisted router in metarouter
      data: swapQuote.data,
      ...(swapQuote.gasPrice ? {gasPrice: BigInt(swapQuote.gasPrice.toString())} : {}),
      ...(swapQuote.value && swapQuote.value > 0 ? {value: BigInt(swapQuote.value.toString())} : {}),
    }
  }

  async getSources(): Promise<[]> {
    const url = `${this.apiEndpoint}sources`

    try {
      const { data }: any = await axios({
        method: "GET",
        url: `${url}`
      })
      return data.recodrs
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }
}