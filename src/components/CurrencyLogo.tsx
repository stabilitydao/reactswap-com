import { Currency } from '@uniswap/sdk-core'
import React from 'react'

import useCurrencyLogoURI from '@/src/hooks/useCurrencyLogoURIs'

export default function CurrencyLogo({
  currency,
  size = '10',
  style,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const inputCurrencyLogo = useCurrencyLogoURI(currency)
  return (
    <img className={`rounded-full w-${size} h-${size} mr-4`} style={style} src={inputCurrencyLogo} alt={currency ? `${currency.symbol} logo` : 'no logo'} />
  )
}
