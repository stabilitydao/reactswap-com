import { useWeb3React } from '@web3-react/core'
import { useState } from 'react'
import Modal from '@/components/Modal'
import { shortenAddress } from '@/src/utils'
import ConnectWallet from '@/components/ConnectWallet'

export default function Web3Status() {
  const { deactivate, account } = useWeb3React()
  const [modalOpened, setModalOpened] = useState<boolean>(false)

  const toggleAccountModal = () => {
    setModalOpened(!modalOpened)
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
        <>
          <button className="bg-orange-300 dark:bg-teal-800 px-4 h-10 rounded-2xl" onClick={toggleAccountModal}>{shortenAddress(account)}</button>
          <Modal isOpen={modalOpened} onDismiss={toggleAccountModal} maxHeight={80} minHeight={20}>
            <div className="flex flex-col w-full">
              <div className="flex justify-center text-lg text-center w-full py-3">Account</div>
              <div className="flex w-full items-center justify-center flex-col">
                <div>{account}</div>
                <button className="flex btn bg-amber-800 px-5" onClick={disconnect}>Disconnect wallet</button>
              </div>
            </div>
          </Modal>
        </>
      ) : (
        <ConnectWallet />
      )}
    </>
  )
}