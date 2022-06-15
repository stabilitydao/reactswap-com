import { useWeb3React } from '@web3-react/core'
import { useState } from 'react'
import Modal from '@/components/Modal'
import { injected } from '@/src/connectors'
import { shortenAddress } from '@/src/utils'
import { BiWallet } from 'react-icons/bi'

export default function Web3Status() {
  const { activate, deactivate, account } = useWeb3React()
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

  async function disconnect() {
    try {
      deactivate()
      setModalOpened(false)
    } catch (ex) {
      console.log(ex)
    }
  }

  return (
    <>
      {account ? (
          <button className="bg-orange-300 dark:bg-teal-800 px-4 h-10 rounded-2xl" onClick={toggleWalletModal}>{shortenAddress(account)}</button>
      ) : (
        <button className="flex items-center dark:bg-blue-800 px-4 h-10 rounded-2xl" onClick={toggleWalletModal}>
          <BiWallet className="text-xl md:hidden" /> <span className="hidden md:flex">Connect wallet</span>
        </button>
      )}
      <Modal isOpen={modalOpened} onDismiss={toggleWalletModal} maxHeight={80} minHeight={20}>
        {account ? (
          <div className="flex flex-col w-full">
            <div className="flex justify-center text-lg text-center w-full py-3">Account</div>
            <div className="flex w-full items-center justify-center flex-col">
              <div>{account}</div>
              <button className="flex btn bg-amber-800 px-5" onClick={disconnect}>Disconnect wallet</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full">
            <div className="flex justify-center text-lg text-center w-full py-3">Choose your wallet</div>
            <div className="flex w-full items-center justify-center flex-col">
              <button className="flex btn bg-amber-700 px-5 text-xl" onClick={connect}>Metamask / browser wallet</button>
            </div>
          </div>
        )}
      </Modal>

    </>
  )
}