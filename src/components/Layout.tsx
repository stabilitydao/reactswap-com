import Head from 'next/head'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from 'next-themes'
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <main className="">
        <Head>
          <title>ReactSwap</title>
          <meta name="description" content="ReactSwap decentralized exchange" />
          <link rel="shortcut icon" type="image/png" href="/img/react.png" />
        </Head>
        <div className="from-green-50 to-orange-200 bg-gradient-to-tr dark:from-violet-900 dark:via-black dark:to-red-900 font-Roboto dark:text-white dark:bg-teal-900">
          <Navbar />
          {children}
        </div>
      </main>
    </ThemeProvider>
  )
}

export default Layout
