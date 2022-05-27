import { SwapAggregator } from '@/src/interfaces/SwapAggregator'
import { AggregatorId } from '@/src/enums/AggregatorId'
import { ChainId } from '@/src/enums/ChainId'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import axios from "axios";
import { SwapQuote } from '@/src/types/SwapQuote'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { fee, feeReceiver } from '@/src/constants/fees'

export class OneInch implements SwapAggregator {
  id: AggregatorId = AggregatorId.OneInch
  chainId: ChainId
  apiEndpoint: string
  logoURI: string

  public constructor(chainId: ChainId, apiEndpoint: string, logoURI: string) {
    this.chainId = chainId
    this.apiEndpoint = apiEndpoint
    this.logoURI = logoURI
  }

  // getting swap without parsing and typing
  async getSources(): Promise<[]> {
    const url = `${this.apiEndpoint}liquidity-sources`

    try {
      const { data }: any = await axios({
        method: "GET",
        url: `${url}`
      })
      // console.log(data)
      return data.protocols

    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }

  async getAllowanceTarget(swapQuote?: SwapQuote): Promise<string|undefined> {
    const url = `${this.apiEndpoint}approve/spender`

    try {
      const { data }: any = await axios({
        url,
      })
      console.log('1Inch allowance target reply raw data:', data)

      return data.address
    } catch (error: any) {
      console.log('1Inch allowance target reply error:', error)
      return undefined
    }
  }

  async getQuote(token0: Currency, token1: Currency, amount: CurrencyAmount<Currency>): Promise<SwapQuote> {
    const params = {
      fromTokenAddress: token0.isToken ? token0.address : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      toTokenAddress: token1.isToken ? token1.address : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      amount: amount.quotient.toString(),
      fee,
    }

    const url = `${this.apiEndpoint}quote`

    try {
      const { data }: any = await axios({
        url,
        params,
      })
      console.log('1Inch quote reply raw data:', data)

      return {
        chainId: this.chainId,
        protocolId: this.id,
        inputAmount: amount.quotient.toString(),
        inputCurrencyId: params.fromTokenAddress,
        outputCurrencyId: params.toTokenAddress,
        outputAmount: data.toTokenAmount,
        outputAmountFixed: CurrencyAmount.fromRawAmount(token1, data.toTokenAmount).toFixed(6),
        estimatedGas: data.estimatedGas,
        sources: data.protocols,
      }
    } catch (error: any) {
      if (error.request && error.request.response) {
        const parsedResponse = JSON.parse(error.request.response)
        if (parsedResponse && parsedResponse.statusCode == 400 && parsedResponse.description) {
          // console.log('1Inch quote error 400:', parsedResponse.description)
          return {
            chainId: this.chainId,
            protocolId: this.id,
            inputAmount: amount.quotient.toString(),
            inputCurrencyId: params.fromTokenAddress,
            outputCurrencyId: params.toTokenAddress,
            error: parsedResponse.description
          }
        }
      }
      // console.log(error.request.response)
      return {
        chainId: this.chainId,
        protocolId: this.id,
        inputAmount: amount.quotient.toString(),
        inputCurrencyId: params.fromTokenAddress,
        outputCurrencyId: params.toTokenAddress,
        error: JSON.stringify(error)
      }
    }
  }

  async buildTx(
    token0: Currency,
    token1: Currency,
    amount: CurrencyAmount<Currency>,
    from: string,
    allowanceTarget: string,
    swapQuote?: SwapQuote,
    slippage?: number,
    gasLimit?: string
  ): Promise<TransactionRequest|undefined> {
    const params = {
      fromTokenAddress: token0.isToken ? token0.address : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      toTokenAddress: token1.isToken ? token1.address : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      amount: amount.quotient.toString(),
      fromAddress: from,
      slippage: '2',
      fee,
      referrerAddress: feeReceiver[this.chainId],
    }

    const url = `${this.apiEndpoint}swap`

    try {
      const { data }: any = await axios({
        url,
        params,
      })
      console.log('1Inch swap reply raw data:', data)

      return {
        from,
        to: allowanceTarget,
        value: BigInt(data.tx.value),
        data: data.tx.data,
        gasLimit: BigInt(data.tx.gas),
        gasPrice: BigInt(data.tx.gasPrice)
      }
    } catch (error: any) {
      if (error.request && error.request.response) {
        const parsedResponse = JSON.parse(error.request.response)
        console.error(parsedResponse)
        return undefined
      }
      // console.log(error.request.response)
      return undefined
    }
  }
}