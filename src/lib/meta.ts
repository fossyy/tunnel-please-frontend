import { useEffect } from 'react'

export const SITE_TITLE = 'tunel.live | Free SSH tunnels for local development'
export const SITE_DESCRIPTION =
  'Create an HTTP/HTTPS or TCP tunnel to your local service with one SSH command. Free hosted servers, no registration required, or self-host Tunnel Please.'

// Keeps the document title and description in React instead of index.html.
export function usePageMeta(title = SITE_TITLE, description = SITE_DESCRIPTION) {
  useEffect(() => {
    document.title = title
    let tag = document.querySelector('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'description')
      document.head.append(tag)
    }
    tag.setAttribute('content', description)
  }, [title, description])
}
