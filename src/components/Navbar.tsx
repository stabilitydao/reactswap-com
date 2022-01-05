import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from '@heroicons/react/solid'

function Navbar() {
  const [Mounted, setMounted] = useState(false)
  const { setTheme, systemTheme, theme } = useTheme()

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
      <h1 className="text-3xl">ReactSwap</h1>
      {themeChanger()}
    </nav>
  )
}

export default Navbar
