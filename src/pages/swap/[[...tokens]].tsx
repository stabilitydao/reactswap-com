import type { NextPage } from 'next'
import { TokenListProvider } from '@/src/hooks/useTokenList'
import Swap from '@/components/Swap'
const p: NextPage = () => {
  return <>
    <div className="flex w-full flex-col items-center px-5 lg:px-10">
      <div className="text-3xl mt-5 mb-2 md:mb-5 lg:mt-2">Swap tokens at the best price</div>
      <TokenListProvider>
        <Swap />
      </TokenListProvider>
    </div>
  </>
}

export default p
