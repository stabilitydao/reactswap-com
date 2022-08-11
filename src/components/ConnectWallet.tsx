import { useWeb3React } from '@web3-react/core'
import { useState } from 'react'
import { injected } from '@/src/connectors'
import { BiWallet } from 'react-icons/bi'
import Modal from '@/components/Modal'

export default function ConnectWallet({smCollapse = false} : {smCollapse?: boolean}) {
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
      <Modal isOpen={modalOpened} onDismiss={toggleWalletModal} maxHeight={80} minHeight={20}>
        <div className="flex flex-col w-full">
          <div className="flex justify-center text-lg text-center w-full py-3">Choose your wallet</div>
          <div className="flex w-full items-center justify-center flex-col">
            <button className="flex btn bg-amber-200 dark:bg-amber-700 px-5 text-xl" onClick={connect}>Metamask / browser wallet</button>
          </div>
        </div>
      </Modal>
    </>
  )
}