import type { NextPage } from 'next'
import { TokenListProvider } from '@/src/hooks/useTokenList'
import Swap from '@/components/Swap'
const p: NextPage = () => {
  return <>
    <div className="flex container flex-col items-center px-5 py-10">
      <div className="text-3xl mt-8 mb-5">MVP-1: Swap at the best price</div>
      <TokenListProvider>
        <Swap />
      </TokenListProvider>
    </div>
  </>
}

export default p
