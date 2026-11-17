import { beforeEach, describe, expect, it } from 'vitest'
import { PING_TTL, readPingCache, writePingCache } from './pingCache'

const store = new Map()
globalThis.localStorage = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => { store.set(key, String(value)) },
} as unknown as Storage

describe('ping cache', () => {
  beforeEach(() => store.clear())

  it('returns fresh results', () => {
    const latency = { sgp: 20, eu: 558, us: 670 }
    writePingCache(latency, 1000)
    expect(readPingCache(1000 + PING_TTL - 1)).toEqual(latency)
  })

  it('expires after the TTL', () => {
    writePingCache({ sgp: 20 }, 1000)
    expect(readPingCache(1000 + PING_TTL + 1)).toBeNull()
  })

  it('ignores an empty or corrupt entry', () => {
    expect(readPingCache()).toBeNull()
    store.set('tunel-ping', 'not json')
    expect(readPingCache()).toBeNull()
    store.set('tunel-ping', JSON.stringify({ latency: { sgp: 20 } }))
    expect(readPingCache()).toBeNull()
  })
})
