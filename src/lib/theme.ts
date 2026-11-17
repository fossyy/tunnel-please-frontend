import { useCallback, useEffect, useState } from 'react'

const KEY = 'tunel-theme'

// Applied before React renders, so the first painted frame already has the
// stored theme.
export function applyStoredTheme() {
  try {
    const saved = localStorage.getItem(KEY)
    const dark = saved === 'dark' || (!saved && matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', dark)
  } catch {
    // storage blocked: fall back to the light theme
  }
}

function current() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(current)

  // Keep the toggle honest if another tab changes the stored choice.
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== KEY) return
      const next = event.newValue === 'dark' ? 'dark' : 'light'
      document.documentElement.classList.toggle('dark', next === 'dark')
      setTheme(next)
    }
    addEventListener('storage', onStorage)
    return () => removeEventListener('storage', onStorage)
  }, [])

  const toggle = useCallback(() => {
    const next = current() === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // Private mode: the toggle still works for this page view.
    }
    setTheme(next)
  }, [])

  return { theme, toggle }
}
