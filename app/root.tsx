import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'
import type { Route } from './+types/root'
import './app.css'
import fontSans from './assets/fonts/plex-sans.woff2?url'

export const links: Route.LinksFunction = () => [
  {
    rel: 'preload',
    href: fontSans,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details = error.statusText || details
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="mx-auto max-w-3xl p-6 text-body">
      <h1 className="text-3xl font-medium text-ink">{message}</h1>
      <p className="mt-3">{details}</p>
      {stack && (
        <pre className="mt-4 overflow-x-auto rounded-md bg-term p-4 text-sm text-term-text">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
