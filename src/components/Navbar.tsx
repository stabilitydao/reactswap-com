import { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from '@heroicons/react/solid'
import { selectNetworkName } from '@/src/state/network'
import { useChainId } from '@/src/state/network/hooks'
import Web3Status from '@/components/Web3Status'
import { networks } from '@/src/constants/networks'
import { Theme, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function Navbar() {
  const [Mounted, setMounted] = useState(false)
  const { setTheme, systemTheme, theme } = useTheme()
  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = Mounted && currentTheme === 'dark'

  const chainId = useChainId()
  const currentNetworkName = useSelector(selectNetworkName)

  useEffect(() => {
    setMounted(true)
  }, [])

  const themeChanger = () => {
    if (!Mounted) {
      return null
    }

    if (isDark) {
      return (
        <SunIcon
          className="w-7 h-7 text-amber-500"
          role="button"
          onClick={() => {
            setTheme('light')
          }}
        />
      )
    } else {
      return (
        <MoonIcon
          className="w-7 h-7 text-red-900"
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
      <a
        href="/"
        className="flex"
      >
        <img src="/img/react.gif" className="h-12 w-12" alt="" />{' '}
        <h1 className=" ml-3 self-center font-bold text-2xl hidden md:flex">ReactSwap</h1>
      </a>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        closeOnClick
        theme={theme as Theme}
      />
      <div className="flex items-center">
        <div className="mr-4">
          <Web3Status />
        </div>
        <div
          className={`flex items-center mr-4 px-5 h-10 rounded-xl`}
          style={{
            background: isDark ? networks[chainId].darkBg ?? 'black' : networks[chainId].bg ?? 'transparent',
          }}
        >
          <img
            src={networks[chainId].logo} alt={networks[chainId].name}
            className="w-7 h-7"
          />
          <span className="hidden md:flex ml-3">
            {currentNetworkName}
          </span>
        </div>
        {themeChanger()}
      </div>
    </nav>
  )
}

export default Navbar
