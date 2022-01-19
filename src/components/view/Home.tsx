// import { useTheme } from 'next-themes'
import { BsDiscord, BsGithub, BsTelegram, BsTwitter } from 'react-icons/bs'

function Home() {
  // const { theme } = useTheme()

  return (
    <div
      className="  flex flex-col justify-center items-center text-center"
      style={{ minHeight: 'calc(100vh - 64px)' }}
    >
      <div className="flex container flex-col items-center px-5 py-10">
        <img
          style={{ maxWidth: '500px' }}
          src="/reacttoken.svg"
          alt="ReactSwap"
        />
        <div className="text-6xl md:text-8xl mt-8">ReactSwap</div>
        <br />
        <div className="text-5xl md:text-6xl mt-8">Decentralized exchange</div>
        <div className="text-3xl text-left my-5 max-w-lg w-full">
          <ul>
            <li>Uniswap-V2 based AMM</li>
            <li>LP lock</li>
            <li>Liquidity migration</li>
            <li>Limit orders</li>
          </ul>
        </div>

        <br />

        <div className="text-5xl md:text-6xl mt-8">Yield farms</div>
        <div className="text-3xl text-left my-5 max-w-lg w-full">
          <ul>
            <li>Liquidity mining farms</li>
            <li>Isolated lending & leverage farms</li>
            <li>Initial farm offering launchpad</li>
          </ul>
        </div>

        <br />

        <div className="text-5xl md:text-6xl mt-8">Staking</div>
        <div className="text-3xl text-left my-5 max-w-lg w-full">
          <ul>
            <li>React SYRUP pools</li>
            <li>X-Stake Bar swap and lending fees pool</li>
            <li>rSYRUP and xREACT governance tokens</li>
          </ul>
        </div>

        <br />

        <div className="text-5xl md:text-6xl mt-8">More features</div>
        <div className="text-3xl text-left my-5 max-w-lg w-full">
          <ul>
            <li>Trading competitions</li>
            <li>Prediction</li>
            <li>Lottery</li>
          </ul>
        </div>

        <br />

        <div className="text-5xl md:text-6xl mt-8">Developed by DAO</div>
        <div className="text-3xl text-left my-5 max-w-lg w-full">
          <ul>
            <li>Ecosystem unit</li>
            <li>Community-driven</li>
            <li>Transparent development</li>
            <li>Modern technology stack</li>
          </ul>
        </div>
        <br />
        <br />
        <br />

        <div className="flex text-6xl gap-10 mt-8">
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
