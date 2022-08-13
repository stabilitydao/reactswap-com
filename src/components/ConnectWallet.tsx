import { useWeb3React } from '@web3-react/core'
import { useState } from 'react'
import { injected, getWalletConnect } from '@/src/connectors'
import { BiWallet } from 'react-icons/bi'
import Modal from '@/components/Modal'
import {useChainId} from "@/src/state/network/hooks";

export default function ConnectWallet({smCollapse = false} : {smCollapse?: boolean}) {
  const chainId = useChainId()
  const { activate, account } = useWeb3React()
  const [modalOpened, setModalOpened] = useState<boolean>(false)

  const toggleWalletModal = () => {
    setModalOpened(!modalOpened)
  }

  async function connect() {
    try {
      await activate(injected)
    } catch (ex) {
      console.log(ex)
    }

    setModalOpened(false)
  }

  async function connectWalletConnect() {
    try {
      await activate(getWalletConnect(chainId), error => {
        console.error(error)
      })

    } catch (ex) {
      console.log(ex)
    }

    setModalOpened(false)
  }

  return (
    <>
      {!account &&
        <button className="flex w-full items-center dark:bg-green-800 px-5 h-10 rounded-2xl justify-center" onClick={toggleWalletModal}>
          {smCollapse ? (
              <>
                <BiWallet className="text-xl md:hidden" /> <span className="hidden md:flex">Connect wallet</span>
              </>
          ) : (
            <>
              <span>Connect wallet</span>
            </>
            )}
        </button>
      }
      <Modal isOpen={modalOpened} onDismiss={toggleWalletModal} maxHeight={100} minHeight={20}>
        <div className="flex flex-col w-full pb-5">
          <div className="flex justify-center text-lg text-center w-full py-3">Choose your wallet</div>
          <div className="flex w-full items-center justify-center flex-col gap-5 px-5">
            <button className="flex h-20 items-center w-full btn border-amber-200 dark:border-amber-800 border-2 rounded-xl px-5 text-xl font-bold dark:hover:bg-amber-900" onClick={connect}>
              <img src="/img/metamask.webp" alt="Metamask" className="h-10 w-10 mr-5" />
              Metamask / browser wallet
            </button>
            <button className="flex h-20 items-center w-full btn border-amber-200 dark:border-amber-800 border-2 rounded-xl px-5 text-xl font-bold dark:hover:bg-amber-900" onClick={connectWalletConnect}>
              <img src="/img/walletconnect.png" alt="Metamask" className="h-10 w-10 mr-5" />
              WalletConnect
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}