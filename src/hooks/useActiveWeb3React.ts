import { useEffect, useState, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { getRpcProvider } from '@/src/utils/rpc'
import { useChainId } from '@/src/state/network/hooks'

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = (): Web3ReactContextInterface<Web3Provider> => {
  const currentChainId = useChainId()
  const simpleRpcProvider = getRpcProvider(currentChainId)
  const { library, chainId, ...web3React } = useWeb3React()

  const refEth = useRef(library)

  const [provider, setProvider] = useState(library && chainId == currentChainId ? library : simpleRpcProvider)

  useEffect(() => {
    if (library !== refEth.current) {
      setProvider(library || simpleRpcProvider)
      refEth.current = library
    }
  }, [library])

  return { library: provider, chainId: currentChainId, ...web3React }
}

export default useActiveWeb3React
