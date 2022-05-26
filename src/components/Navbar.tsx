import { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from '@heroicons/react/solid'
import { selectNetworkName } from '@/src/state/network'
import { useChainId } from '@/src/state/network/hooks'
import Web3Status from '@/components/Web3Status'

function Navbar() {
  const [Mounted, setMounted] = useState(false)
  const { setTheme, systemTheme, theme } = useTheme()

  // const currentNetwork = useSelector((state: AppState) => state.network.chainId)
  // const currentNetworkName = useSelector((state: AppState) => state.network.name)
  const currentNetwork = useChainId()
  const currentNetworkName = useSelector(selectNetworkName)

  useEffect(() => {
    setMounted(true)
  }, [])
  const themeChanger = () => {
    if (!Mounted) return null
    const currentTheme = theme === 'system' ? systemTheme : theme
    if (currentTheme === 'dark') {
      return (
        <SunIcon
          className="w-7 h-7"
          role="button"
          onClick={() => {
            setTheme('light')
          }}
        />
      )
    } else {
      return (
        <MoonIcon
          className="w-7 h-7"
          role="button"
          onClick={() => {
            setTheme('dark')
          }}
        />
      )
    }
  }
  return (
    <nav className="h-16 flex flex-row items-center justify-between px-6">
      <div className="flex">
        <img src="/reacttoken.svg" className="h-10 w-10" alt="" />{' '}
        <h1 className=" ml-3 self-center font-bold text-2xl">ReactSwap</h1>
      </div>
      <div className="flex items-center">
        <div className="mr-4">
          <Web3Status />
        </div>
        <div className="flex items-center mr-4 px-4 h-10 rounded-xl dark:border-indigo-600 border-2">{currentNetworkName} [{currentNetwork}]</div>
        {themeChanger()}
      </div>
    </nav>
  )
}

export default Navbar
