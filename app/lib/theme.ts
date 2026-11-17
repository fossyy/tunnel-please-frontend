import { useCallback, useSyncExternalStore } from 'react'

const KEY = 'tunel-theme'
const THEME_EVENT = 'tunel-theme-change'
type Theme = 'light' | 'dark'

export function applyStoredTheme() {
  try {
    const saved = localStorage.getItem(KEY)
    const dark = saved === 'dark' || (!saved && matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', dark)
  } catch {
    // Storage may be unavailable; the light theme remains the safe fallback.
  }
}

const read = (): Theme =>
  typeof document === 'undefined' ? 'light' : document.documentElement.classList.contains('dark') ? 'dark' : 'light'

const subscribe = (onChange: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return
    document.documentElement.classList.toggle('dark', event.newValue === 'dark')
    onChange()
  }
  addEventListener('storage', onStorage)
  addEventListener(THEME_EVENT, onChange)
  return () => {
    removeEventListener('storage', onStorage)
    removeEventListener(THEME_EVENT, onChange)
  }
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => 'light' as Theme)
  const toggle = useCallback(() => {
    const next = read() === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // Private mode: the toggle still works for this page view.
    }
    dispatchEvent(new Event(THEME_EVENT))
  }, [])
  return { theme, toggle }
}
