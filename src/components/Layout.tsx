import Head from 'next/head'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from 'next-themes'
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <main className="">
        <Head>
          <title>ReactSwap</title>
          <meta name="description" content="ReactSwap decentralized exchange" />
        </Head>
        <div className="from-teal-200 to-blue-200 bg-gradient-to-br dark:from-teal-900 dark:via-black dark:to-blue-900 font-Roboto dark:text-white dark:bg-teal-900">
          <Navbar />
          {children}
        </div>
      </main>
    </ThemeProvider>
  )
}

export default Layout
