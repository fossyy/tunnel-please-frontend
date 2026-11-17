import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import Landing from '../pages/Landing'
import NotFound from '../pages/NotFound'

function render(element: ReactNode) {
  return renderToStaticMarkup(<MemoryRouter>{element}</MemoryRouter>)
}

describe('pages render', () => {
  it('landing shows the terminal and the server picker', () => {
    const html = render(<Landing />)
    expect(html).toContain('Build your tunnel command')
    expect(html).toContain('Copy command')
    expect(html).toContain('$ ')
    expect(html).toContain('Server location')
    expect(html).toContain('us.tunel.live')
    expect(html).toContain('eu.tunel.live')
    expect(html).toContain('role="radiogroup"')
    expect((html.match(/type="radio"/g) || []).length).toBeGreaterThanOrEqual(3)
  })

  it('landing does not invent latency or offline claims', () => {
    const html = render(<Landing />)
    expect(html).not.toMatch(/\d+\s?ms/)
    expect(html).not.toContain('Operational')
    expect(html).not.toContain('open source')
  })

  it('not found page offers a route back', () => {
    expect(render(<NotFound />)).toContain('Page not found')
  })
})
