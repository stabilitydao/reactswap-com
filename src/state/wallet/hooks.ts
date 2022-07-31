import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import useActiveWeb3React from '@/src/hooks/useActiveWeb3React'
import { useTokenBalance, useTokenBalances } from '@/src/hooks/useCurrencyBalance'
import { useMemo } from 'react'

import { useAllTokens } from '@/src/hooks/useTokenList'

export {
  useCurrencyBalances,
  useNativeCurrencyBalances,
  useTokenBalance,
  useTokenBalances,
  useTokenBalancesWithLoadingIndicator,
} from '@/src/hooks/useCurrencyBalance'

// mimics useAllBalances
export function useAllTokenBalances(): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  const { account } = useActiveWeb3React()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  const balances = useTokenBalances(account ?? undefined, allTokensArray)
  return balances ?? {}
}
