import { describe, expect, it } from 'vitest'
import { buildCommand, parsePort } from './command'

describe('parsePort', () => {
  it('accepts integers in range only', () => {
    expect(parsePort('8000')).toBe(8000)
    expect(parsePort(' 443 ')).toBe(443)
    expect(parsePort('0')).toBeNull()
    expect(parsePort('65536')).toBeNull()
    expect(parsePort('80.5')).toBeNull()
    expect(parsePort('abc')).toBeNull()
    expect(parsePort('')).toBeNull()
  })

  it('honours the TCP range', () => {
    expect(parsePort('19999', 20000, 21000)).toBeNull()
    expect(parsePort('20443', 20000, 21000)).toBe(20443)
    expect(parsePort('21001', 20000, 21000)).toBeNull()
  })
})

describe('buildCommand', () => {
  it('builds the HTTPS command', () => {
    expect(buildCommand({ host: 'sgp.tunel.live', mode: 'http', webPort: 443, localPort: '8000' })).toBe(
      'ssh sgp.tunel.live -p 2200 -R 443:localhost:8000',
    )
  })

  it('keeps the HTTP port when selected', () => {
    expect(buildCommand({ host: 'eu.tunel.live', mode: 'http', webPort: 80, localPort: 3000 })).toBe(
      'ssh eu.tunel.live -p 2200 -R 80:localhost:3000',
    )
  })

  it('builds the TCP command inside the supported range', () => {
    expect(buildCommand({ host: 'eu.tunel.live', mode: 'tcp', serverPort: '20443', localPort: '5432' })).toBe(
      'ssh eu.tunel.live -p 2200 -R 20443:localhost:5432',
    )
  })

  it('returns null instead of emitting an invalid command', () => {
    expect(buildCommand({ host: 'sgp.tunel.live', mode: 'http', localPort: '0' })).toBeNull()
    expect(buildCommand({ host: 'sgp.tunel.live', mode: 'tcp', serverPort: '9999', localPort: '5432' })).toBeNull()
    expect(buildCommand({ host: 'sgp.tunel.live', mode: 'custom', localPort: '8000' })).toBeNull()
  })
})
