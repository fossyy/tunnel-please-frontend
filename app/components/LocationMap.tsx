import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import land from 'world-atlas/land-110m.json'
import { SERVERS } from '../data/servers'
import type { Polygon } from 'geojson'
import type { Topology, GeometryCollection } from 'topojson-specification'
import type { LatencyMap } from '../lib/pingCache'

const WIDTH = 800
const HEIGHT = 400
type LandTopology = Topology<{ land: GeometryCollection }>
const landTopology = land as unknown as LandTopology
const landShape = feature(landTopology, landTopology.objects.land)

// Fit the visible band, not the whole sphere: Antarctica otherwise squeezes
// every real location into the top third of the map.
const frame = {
  type: 'Polygon',
  coordinates: [
    [
      [-180, 80],
      [180, 80],
      [180, -58],
      [-180, -58],
      [-180, 80],
    ],
  ],
}

const projection = geoNaturalEarth1().fitExtent(
  [
    [6, 6],
    [WIDTH - 6, HEIGHT - 6],
  ],
  frame as Polygon,
)
const landPath = geoPath(projection)(landShape) ?? ''

type Server = (typeof SERVERS)[number]
function pinPosition(server: Server) {
  const point = projection([server.lon, server.lat])
  if (!point) return { left: '0%', top: '0%' }
  const [x, y] = point
  return { left: `${(x / WIDTH) * 100}%`, top: `${(y / HEIGHT) * 100}%` }
}

function latencyLabel(value: number | null | undefined) {
  if (value === undefined) return 'Ping not checked'
  if (value === null) return 'Ping unavailable'
  return `~${value} ms`
}

type Props = { selected: string; onSelect: (id: string) => void; latency: LatencyMap; checking: boolean; onCheckPing: () => void }
export default function LocationMap({ selected, onSelect, latency, checking, onCheckPing }: Props) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 id="locations-heading" className="text-[15px] font-semibold text-ink">
          Server location
        </h3>
        <button
          type="button"
          onClick={onCheckPing}
          disabled={checking}
          aria-label={checking ? 'Checking ping' : undefined}
          className={`inline-flex min-h-11 min-w-[74px] items-center justify-end rounded-sm px-1 text-[13px] font-medium text-action hover:text-ink disabled:cursor-not-allowed disabled:text-muted ${
            checking ? '' : 'underline underline-offset-4'
          }`}
        >
          {checking ? <span className="dot-loader text-action" aria-hidden="true" /> : 'Check ping'}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-md border border-line bg-surface">
        <svg
          className="block h-auto w-full"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="World map showing hosted servers in Chicago, Frankfurt and Singapore"
        >
          <path className="fill-subtle stroke-line" strokeWidth="0.7" d={landPath} />
        </svg>

        {SERVERS.map((server) => {
          const active = server.id === selected
          return (
            <span
              key={server.id}
              aria-hidden="true"
              style={pinPosition(server)}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5"
            >
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-sm border-2 border-surface outline outline-2 outline-offset-1 transition-[background-color,scale,outline-color] duration-200 ${
                  active ? 'scale-125 bg-action outline-action' : 'bg-ink outline-transparent'
                }`}
              />
              <span
                className={`hidden rounded-sm border bg-surface px-1.5 py-0.5 text-[10.5px] font-semibold leading-tight sm:block ${
                  active ? 'border-action text-action' : 'border-line text-ink'
                } ${server.id === 'sgp' ? 'order-first' : ''}`}
              >
                {server.city}
              </span>
            </span>
          )
        })}
      </div>

      <div role="radiogroup" aria-labelledby="locations-heading" aria-busy={checking} className="mt-3 flex flex-col gap-1.5">
        {SERVERS.map((server) => {
          const active = server.id === selected
          return (
            <label key={server.id} className="relative block cursor-pointer">
              <input
                type="radio"
                name="server"
                value={server.id}
                checked={active}
                onChange={() => onSelect(server.id)}
                className="peer sr-only"
              />
              <span
                className={`flex items-center justify-between gap-3 rounded-sm border px-3 py-2.5 transition-colors duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-action ${
                  active
                    ? 'border-action bg-subtle ring-1 ring-action'
                    : 'border-line bg-surface hover:border-action'
                }`}
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink">
                    {server.city}
                    <span className="font-normal text-muted">, {server.country}</span>
                  </span>
                  <span className="block font-mono text-[11px] text-muted">{server.host}</span>
                </span>
                <span className="shrink-0 text-right">
                  {checking && latency[server.id] === undefined ? (
                    <span className="dot-loader ml-auto block w-5 text-action" aria-hidden="true" />
                  ) : (
                    <span
                      key={latency[server.id] ?? 'unchecked'}
                      className="block animate-pop font-mono text-[11px] text-body"
                    >
                      {latencyLabel(latency[server.id])}
                    </span>
                  )}
                  {active && <span className="block animate-pop text-[11px] font-semibold text-action">Selected</span>}
                </span>
              </span>
            </label>
          )
        })}
      </div>

      <p className="mt-2 text-[13px] leading-snug text-muted">
        Ping is the approximate time to open a connection from your browser, not a throughput guarantee.
      </p>
    </div>
  )
}
