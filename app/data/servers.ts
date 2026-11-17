// Hosted server inventory. This is a maintained snapshot, not a live API response.
export const SERVERS = [
  { id: 'us', city: 'Chicago', country: 'United States', host: 'us.tunel.live', lon: -87.6298, lat: 41.8781 },
  { id: 'eu', city: 'Frankfurt', country: 'Germany', host: 'eu.tunel.live', lon: 8.6821, lat: 50.1109 },
  { id: 'sgp', city: 'Singapore', country: 'Singapore', host: 'sgp.tunel.live', lon: 103.8198, lat: 1.3521 },
]

export const DEFAULT_SERVER = 'sgp'

export const SOURCE = 'https://git.fossy.my.id/bagas/tunnel-please'
export const ISSUES = `${SOURCE}/issues`
export const LICENSE = `${SOURCE}/src/branch/main/LICENSE.md`
