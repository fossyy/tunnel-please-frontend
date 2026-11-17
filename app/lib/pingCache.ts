// Ping results are cached so a repeat visit does not probe the tunnel hosts
// again. The manual "Check ping" button bypasses the cache.
const KEY = 'tunel-ping'
export const PING_TTL = 10 * 60 * 1000

export type LatencyMap = Record<string, number | null>
function isLatencyMap(value: unknown): value is LatencyMap {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && Object.values(value).every((item) => item === null || (typeof item === 'number' && Number.isFinite(item)))
}
export function readPingCache(now = Date.now()): LatencyMap | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const cached: unknown = JSON.parse(raw)
    if (!cached || typeof cached !== 'object' || !('at' in cached) || typeof cached.at !== 'number' || now - cached.at > PING_TTL) return null
    if (!('latency' in cached) || !isLatencyMap(cached.latency)) return null
    return cached.latency
  } catch {
    return null
  }
}

export function writePingCache(latency: LatencyMap, now = Date.now()) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ at: now, latency }))
  } catch {
    // storage blocked or full: the next visit simply probes again
  }
}
