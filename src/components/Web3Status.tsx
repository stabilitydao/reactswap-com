import { useWeb3React } from '@web3-react/core'
import { useState } from 'react'
import Modal from '@/components/Modal'
import { injected } from '@/src/connectors'
import { shortenAddress } from '@/src/utils'

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
          <button className="dark: bg-green-600 px-4 h-10 rounded-2xl" onClick={toggleWalletModal}>{shortenAddress(account)}</button>
      ) : (
        <button className="dark: bg-blue-700 px-4 h-10 rounded-2xl" onClick={toggleWalletModal}>Connect wallet</button>
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
              <button className="flex btn bg-amber-700 px-5" onClick={connect}>Metamask</button>
            </div>
          </div>
        )}
      </Modal>

    </>
  )
}