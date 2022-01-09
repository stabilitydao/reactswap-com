// import { useTheme } from 'next-themes'
import {BsDiscord, BsGithub, BsTelegram, BsTwitter} from "react-icons/bs";


function Home() {
  // const { theme } = useTheme()

  return (
    <div
      className="  flex flex-col justify-center items-center text-center"
      style={{ minHeight: 'calc(100vh - 64px)' }}
    >
      <div className="flex container flex-col items-center px-5 py-10">
        <img
            style={{maxWidth: '500px'}}
            src="/reacttoken.svg"
            alt="ReactSwap"
        />
        <div className="text-6xl md:text-8xl mt-8">ReactSwap</div>

        <div className="flex text-2xl md:text-3xl flex-col m-10 text-left font-bold gap-1">
          <div>Decentralized Exchange</div>
          <div>Yield farms</div>
          <div>Lending markets</div>
          <div>Staking</div>
        </div>

        <div className="flex text-6xl gap-10 mt-8">
          <a href="https://github.com/stabilitydao/reactswap" target="_blank" rel="noopener noreferrer"><BsGithub className="cursor-pointer" /></a>
          <a href="https://twitter.com/stabilitydao" target="_blank" rel="noopener noreferrer"><BsTwitter className="cursor-pointer" /></a>
          <a href="https://t.me/stabilitydao" target="_blank" rel="noopener noreferrer" ><BsTelegram className="" /></a>
          <a href="https://discord.gg/R3nnetWzC9" target="_blank" rel="noopener noreferrer" ><BsDiscord className="" /></a>
        </div>
      </div>
    </div>
  )
}

export default Home
