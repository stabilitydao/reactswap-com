import type { NextPage } from 'next'
import { TokenListProvider } from '@/src/hooks/useTokenList'
import Swap from '@/components/Swap'
const p: NextPage = () => {
  return <>
    <div className="flex w-full flex-col items-center px-5 lg:px-10 xl:py-10">
      <div className="text-3xl mt-2 mb-5">Trade tokens at the best price</div>
      <TokenListProvider>
        <Swap />
      </TokenListProvider>
    </div>
  </>
}

export default p
