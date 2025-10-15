// contexts/ThemeContext.js
import { createContext, useState, useEffect, useContext } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) setIsDarkMode(savedTheme === 'dark')

    // Apply theme on document root
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newTheme = !prev
      localStorage.setItem('theme', newTheme ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', newTheme)
      return newTheme
    })
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
