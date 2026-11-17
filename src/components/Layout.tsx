import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import Footer from './Footer'
import { CONTAINER } from '../lib/ui'
import { SOURCE } from '../data/servers'
import type { MouseEvent, KeyboardEvent } from 'react'

const LINKS = [
  { to: '/#configure', label: 'Configure' },
  { to: '/#self-host', label: 'Self-host' },
]

export default function Layout() {
  const { pathname, hash } = useLocation()

  // Hash links are this site's anchor navigation; move focus with the scroll.
  useEffect(() => {
    if (!hash) return
    const target = document.getElementById(hash.slice(1))
    if (!target) return
    target.scrollIntoView({ block: 'start' })
    const heading = target.querySelector('h1, h2')
    if (heading) {
      heading.setAttribute('tabindex', '-1')
      if (heading instanceof HTMLElement) heading.focus({ preventScroll: true })
    }
  }, [pathname, hash])

  function closeMenu(event: MouseEvent<HTMLDivElement>) {
    event.currentTarget.closest('details')?.removeAttribute('open')
  }

  // Native <details> has no Escape handling; close and return focus to the summary.
  function onMenuKeyDown(event: KeyboardEvent<HTMLDetailsElement>) {
    if (event.key !== 'Escape') return
    const details = event.currentTarget
    if (!details.open) return
    details.removeAttribute('open')
    details.querySelector('summary')?.focus()
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-40 focus:rounded-sm focus:border focus:border-line focus:bg-surface focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      <header className="border-b border-line bg-surface">
        <div className={`${CONTAINER} flex min-h-16 flex-wrap items-center justify-between gap-x-8 gap-y-2 py-3`}>
          <Link to="/" className="text-[19px] font-semibold tracking-[-0.01em] text-ink">
            tunel.live
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-sm px-3 py-2 text-[15px] font-medium text-muted transition-colors duration-150 hover:text-ink inline-flex min-h-11 items-center"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={SOURCE}
              target="_blank"
              rel="noreferrer"
              className="rounded-sm px-3 py-2 text-[15px] font-medium text-muted transition-colors duration-150 hover:text-ink inline-flex min-h-11 items-center"
            >
              Source
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <details className="relative md:hidden" onKeyDown={onMenuKeyDown}>
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-sm border border-line px-3 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
                Menu
              </summary>
              <div
                className="absolute right-0 z-30 mt-2 w-56 origin-top rounded-md border border-line bg-surface p-2 shadow-[0_8px_30px_rgb(22_50_60/12%)] transition-[opacity,translate] duration-200 ease-soft starting:opacity-0 starting:-translate-y-1"
                onClick={closeMenu}
              >
                <nav className="flex flex-col" aria-label="Main">
                  {LINKS.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="rounded-sm px-3 py-2.5 text-[15px] font-medium text-muted hover:bg-subtle hover:text-ink inline-flex min-h-11 items-center"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <a
                    href={SOURCE}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-sm px-3 py-2.5 text-[15px] font-medium text-muted hover:bg-subtle hover:text-ink inline-flex min-h-11 items-center"
                  >
                    Source
                  </a>
                </nav>
              </div>
            </details>
          </div>
        </div>
      </header>

      <main id="main">
        <div key={pathname} className="animate-page-in">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  )
}
