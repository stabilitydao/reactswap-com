import { BsDiscord, BsGithub, BsTelegram, BsTwitter } from 'react-icons/bs'
import Swap from '@/components/Swap'
import { TokenListProvider } from '@/src/hooks/useTokenList'

function Home() {
  return (
    <div
      className="  flex flex-col justify-start items-center text-center"
      style={{ minHeight: 'calc(100vh - 64px)' }}
    >
      <div className="flex container flex-col items-center px-5 py-10">
        <div className="text-3xl mt-8 mb-5">MVP-1 v0: Swap at the best price</div>

        <TokenListProvider>
          <Swap />
        </TokenListProvider>

        <div className="hidden flex text-xl gap-10 mt-8">
          <a
            href="https://github.com/stabilitydao/reactswap"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsGithub className="cursor-pointer" />
          </a>
          <a
            href="https://twitter.com/stabilitydao"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsTwitter className="cursor-pointer" />
          </a>
          <a
            href="https://t.me/stabilitydao"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsTelegram className="" />
          </a>
          <a
            href="https://discord.gg/R3nnetWzC9"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsDiscord className="" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Home
