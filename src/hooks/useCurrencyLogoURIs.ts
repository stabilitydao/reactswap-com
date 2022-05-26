import { Currency } from '@uniswap/sdk-core'
import { useMemo } from 'react'
import { WrappedTokenInfo } from '@/src/state/lists/wrappedTokenInfo'
import { ChainId } from '@/src/enums/ChainId'
import { wrappedNative } from '@/src/constants/currencies'


function getNativeLogoURI(chainId: ChainId): string {
  return `/img/${chainId}-native.svg`
}

export default function useCurrencyLogoURI(currency?: Currency): string {
  return useMemo(() => {
    if (currency) {
      if ( currency instanceof WrappedTokenInfo && currency.logoURI) {
        return currency.logoURI
      }
      if (currency.isNative) {
        return getNativeLogoURI(currency.chainId);
      }
      if (currency.isToken && currency.address === wrappedNative[currency.chainId].address) {
        return getNativeLogoURI(currency.chainId);
      }
    }

    return '/img/no-logo.png'
  }, [currency])
}
