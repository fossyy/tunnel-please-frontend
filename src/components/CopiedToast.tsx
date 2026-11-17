import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

// Copy confirmation as a non-blocking toast: it announces itself, never takes
// focus, and stays out of the way of the command box.
export default function CopiedToast({ open, command }: { open: boolean; command: string }) {
  const [mounted, setMounted] = useState(open)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      const frame = requestAnimationFrame(() => setShown(true))
      return () => cancelAnimationFrame(frame)
    }
    setShown(false)
    const timer = setTimeout(() => setMounted(false), 180)
    return () => clearTimeout(timer)
  }, [open])

  if (!mounted) return null

  // Portal: the configurator section is translated by its reveal animation,
  // which would otherwise become the containing block for position:fixed.
  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-[400px] -translate-x-1/2 items-start gap-3 rounded-md border border-line bg-surface p-4 shadow-[0_8px_30px_rgb(22_50_60/12%)] transition-[opacity,translate] duration-200 ease-soft ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-subtle text-action"
      >
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" focusable="false">
          <path
            d="M5 12.5l4.5 4.5L19 7.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">Command copied</p>
        <p className="mt-0.5 truncate font-mono text-[12px] text-muted">{command}</p>
      </div>
    </div>,
    document.body,
  )
}
