import { Currency } from '@uniswap/sdk-core'
import { wrappedNative } from '@/src/constants/currencies'

// get address of DeX asset for currency (wnative for native)
export function currencyAddress(currency: Currency): string {
  if (currency.isNative) {
    return wrappedNative[currency.chainId].address
  }
  return currency.address
}
