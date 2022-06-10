import { BsDiscord, BsGithub, BsTelegram, BsTwitter } from 'react-icons/bs'
import Swap from '@/components/Swap'
import { TokenListProvider } from '@/src/hooks/useTokenList'

function Home() {
  return (
    <div
      className="flex flex-col justify-start items-center text-center"
      style={{ minHeight: 'calc(100vh - 144px)' }}
    >
      <div className="flex container flex-col items-center px-5 py-10">
        <div className="text-3xl mt-8 mb-5">MVP-1: Swap at the best price</div>
        <TokenListProvider>
          <Swap />
        </TokenListProvider>
      </div>
    </div>
  )
}

export default Home
