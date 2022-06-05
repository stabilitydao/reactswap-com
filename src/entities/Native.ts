import { Currency, NativeCurrency } from '@uniswap/sdk-core'
import { Token } from '@uniswap/sdk-core'

export class Native extends NativeCurrency {
  private _wrapped: Token

  constructor(
    chainId: number,
    decimals: number,
    symbol: string,
    name: string,
    wrapped: Token
  ) {
    super(chainId, decimals, symbol, name)
    this._wrapped = wrapped
  }

  public get wrapped(): Token {
    return this._wrapped
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}