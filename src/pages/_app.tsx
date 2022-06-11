import '@/styles/globals.css'
import { Provider } from 'react-redux'
import type { AppProps } from 'next/app'
import store from '../state/store'
import Layout from '@/components/Layout'
import ListsUpdater from '@/src/state/lists/updater'
import MulticallUpdater from '@/src/state/multicall/updater'
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'
import React from 'react'
import { usePollBlockNumber } from '@/src/state/block/hooks'

// @typescript-eslint/no-explicit-any
function getLibrary(provider: any): Web3Provider {
  return new Web3Provider(
    provider,
    typeof provider.chainId === 'number'
      ? provider.chainId
      : typeof provider.chainId === 'string'
        ? parseInt(provider.chainId)
        : 'any'
  )
}

function GlobalHooks() {
  usePollBlockNumber()
  return null
}

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ListsUpdater />
        <MulticallUpdater />
        <GlobalHooks />
        <Layout>
          <div
            className="flex flex-col justify-start items-center text-center"
            style={{ minHeight: 'calc(100vh - 144px)' }}
          >
            <Component {...pageProps} />
          </div>
        </Layout>
      </Web3ReactProvider>
    </Provider>
  )
}
export default MyApp
