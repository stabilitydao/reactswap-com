import {SwapAggregator} from '@/src/interfaces/SwapAggregator'
import {ChainId} from '@/src/enums/ChainId'
import {Currency, CurrencyAmount} from '@uniswap/sdk-core'
import axios from "axios";
import {SwapQuote} from '@/src/types/SwapQuote'
import {TransactionRequest} from '@ethersproject/abstract-provider'
import {ProtocolId} from "@/src/enums/ProtocolId";

export class OpenOcean implements SwapAggregator {
  id: ProtocolId = ProtocolId.openocean
  chainId: ChainId
  apiEndpoint: string
  logoURI: string

  public constructor(chainId: ChainId, apiEndpoint: string, logoURI: string) {
    this.chainId = chainId
    this.apiEndpoint = apiEndpoint
    this.logoURI = logoURI
  }

  async getSources(): Promise<[]> {
    const url = `${this.apiEndpoint}dexList`

    try {
      const { data }: any = await axios({
        method: "GET",
        url: `${url}`
      })
      // console.log(data)
      return data

    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }

  async getAllowanceTarget(swapQuote?: SwapQuote): Promise<string|undefined> {
    return swapQuote?.allowanceTarget
  }

  async getQuote(token0: Currency, token1: Currency, amount: CurrencyAmount<Currency>, slippage: number): Promise<SwapQuote> {
    const params = {
      chain: this.chainName(),
      inTokenAddress: token0.isToken ? token0.address : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      outTokenAddress: token1.isToken ? token1.address : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      amount: amount.toFixed(),
      slippage: '1',
      gasPrice: '30',
    }

    // console.log(params)

    const url = `${this.apiEndpoint}quote`

    try {
      const { data }: any = await axios({
        url,
        params,
      })
      // console.log(`OpenOcean quote reply raw data:`, data)

      return {
        chainId: this.chainId,
        protocolId: this.id,
        inputAmount: amount.quotient.toString(),
        inputCurrencyId: params.inTokenAddress,
        outputCurrencyId: params.outTokenAddress,
        outputAmount: data.data.outAmount,
        outputAmountFixed: CurrencyAmount.fromRawAmount(token1, data.data.outAmount).toFixed(6),
        to: undefined,
        estimatedGas: data.data.estimatedGas,
        sources: data.data.path,
      }
    } catch (error: any) {
      // console.log(error.request.response)
      return {
        chainId: this.chainId,
        protocolId: this.id,
        inputAmount: amount.quotient.toString(),
        inputCurrencyId: params.inTokenAddress,
        outputCurrencyId: params.outTokenAddress,
        error: error.toString()
      }
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
    const params = {
      chain: this.chainName(),
      inTokenAddress: token0.isToken ? token0.address : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      outTokenAddress: token1.isToken ? token1.address : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      amount: amount.toFixed(),
      account: from,
      slippage: slippage && slippage > 1 ? slippage : 1,
      gasPrice: '30',
    }

    const url = `${this.apiEndpoint}swap_quote`

    try {
      const { data }: any = await axios({
        url,
        params,
      })
      // console.log(`OpenOcean swap reply raw data:`, data)

      return {
        from,
        to: data.data.to, // whitelisted router in metarouter
        value: BigInt(data.data.value),
        data: data.data.data,
        gasLimit: BigInt(data.data.estimatedGas),
        gasPrice: BigInt(data.data.gasPrice)
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

  private chainName(): string {
    // bsc, eth, polygon, fantom, avax, heco, okex, xdai, arbitrum, optimism, moonriver, boba, ont, tron, solana, terra, aurora
    if (this.chainId === ChainId.POLYGON) {
      return 'polygon'
    }

    return 'eth'
  }
}

export type OpenOceanSubRoute = {
  from: string,
  to: string,
  dexes: {
    dex: string,
  }[],
  parts: number,
}