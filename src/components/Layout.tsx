import Head from 'next/head'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from 'next-themes'
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <main className="">
        <Head>
          <title>ReactSwap</title>
          <meta name="description" content="Nft marketplace" />
        </Head>
        <div className="font-Roboto dark:text-white bg-teal-200 dark:bg-teal-900">
          <Navbar />
          {children}
        </div>
      </main>
    </ThemeProvider>
  )
}

export default Layout
