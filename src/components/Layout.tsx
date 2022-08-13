import Head from 'next/head'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from 'next-themes'
import { BsDiscord, BsGithub, BsTelegram, BsTwitter } from 'react-icons/bs'
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <main className="">
        <Head>
          <title>ReactSwap</title>
          <meta name="description" content="ReactSwap decentralized swap at the best price" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="shortcut icon" type="image/png" href="/img/favicon.png" />
        </Head>
        <div className="relative from-green-50 to-orange-200 bg-gradient-to-tr dark:from-[#454344] dark:to-[#543a3b] font-Roboto dark:text-white dark:bg-teal-900 h-full pb-20 w-screen">
          <Navbar />
          {children}
          <div className="flex absolute left-0 bottom-0 w-full h-20 dark:bg-[#302b2b]">
            <div className="flex w-full md:w-1/2 items-center h-full pl-8">
              <div className="flex text-xl gap-4 items-center">
                <a
                  href="https://github.com/stabilitydao/reactswap-com"
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
            <div className="flex w-full md:w-1/2 justify-end items-center h-full">
              <div className="text-sm flex items-center pr-8">
                <a
                  href="https://stabilitydao.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Developed by StabilityDAO"
                >
                  <img className="w-12 h-12" src='https://stabilitydao.org/logo256.png' alt='StabilityDAO' />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ThemeProvider>
  )
}

export default Layout
