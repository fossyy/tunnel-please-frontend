import { useEffect, useRef, useState } from 'react'
import { buildCommand, parsePort, TCP_MAX, TCP_MIN } from '../lib/command'
import { DEFAULT_SERVER, SERVERS } from '../data/servers'
import { BTN_TERM, CONTAINER, SECTION } from '../lib/ui'
import LocationMap from './LocationMap'
import CopiedToast from './CopiedToast'
import { useReducedMotion } from '../lib/useReducedMotion'
import { readPingCache, writePingCache } from '../lib/pingCache'
import { copyText } from '../lib/clipboard'
import type { LatencyMap } from '../lib/pingCache'

const MODES = [
  { id: 'http', label: 'HTTPS' },
  { id: 'tcp', label: 'TCP' },
]

const SEGMENT =
  'flex min-h-12 flex-1 cursor-pointer items-center justify-center rounded-sm px-2 text-center text-sm font-semibold text-body transition-colors duration-150 hover:text-ink peer-checked:text-on-ink peer-checked:hover:text-on-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-action'

const LOCKED_SEGMENT =
  'flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-sm px-2 text-center text-sm font-semibold text-muted'

// The tunnel hosts answer every HTTP path with a redirect loop, so a fetch
// never settles. A WebSocket handshake gives a real TCP + TLS round trip and
// fails fast, which is what we time here.
// shortcut: 3s cap keeps a worst-case all-hosts-down sweep at ~9s, not 15s.
function probe(host: string, timeout = 3000): Promise<number | null> {
  return new Promise((resolve: (value: number | null) => void) => {
    const start = performance.now()
    let settled = false
    let socket: WebSocket | undefined

    const finish = (value: number | null) => {
      if (settled) return
      settled = true
      try {
        socket?.close()
      } catch {
        // already closed
      }
      resolve(value)
    }

    try {
      socket = new WebSocket(`wss://${host}`)
    } catch {
      finish(null)
      return
    }

    const measure = () => finish(Math.round(performance.now() - start))
    socket.onerror = measure
    socket.onopen = measure
    setTimeout(() => finish(null), timeout)
  })
}

async function measure(host: string): Promise<number | null> {
  const first = await probe(host)
  if (first === null) return null
  const second = await probe(host)
  return second === null ? first : Math.min(first, second)
}

export default function Configurator() {
  const [serverId, setServerId] = useState(DEFAULT_SERVER)
  const [mode, setMode] = useState('http')
  const [localPort, setLocalPort] = useState('8000')
  const [serverPort, setServerPort] = useState('20443')

  const [latency, setLatency] = useState<LatencyMap>({})
  const [checking, setChecking] = useState(false)

  const [copyState, setCopyState] = useState<'error' | null>(null)
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const reduced = useReducedMotion()
  const terminalRef = useRef<HTMLDivElement>(null)
  const played = useRef(false)
  const [phase, setPhase] = useState<'idle' | 'typing' | 'done'>('idle')
  const [typed, setTyped] = useState(0)

  const server = SERVERS.find((item) => item.id === serverId) ?? SERVERS[0]
  const command = buildCommand({ host: server.host, mode, webPort: 443, serverPort, localPort })
  const validCommand = useRef(command)

  useEffect(() => {
    if (command) validCommand.current = command
  }, [command])
  const shownCommand = command ?? validCommand.current

  const localPortError = parsePort(localPort) === null ? 'Enter a whole port between 1 and 65535.' : null
  const serverPortError =
    mode === 'tcp' && parsePort(serverPort, TCP_MIN, TCP_MAX) === null
      ? `Enter a remote port between ${TCP_MIN} and ${TCP_MAX}.`
      : null

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  // Play the session once, when the terminal first comes into view.
  useEffect(() => {
    if (!shownCommand) return
    if (reduced) {
      setPhase('done')
      setTyped(shownCommand.length)
      return
    }
    if (played.current) return
    const node = terminalRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || played.current) return
        played.current = true
        observer.disconnect()
        setTyped(0)
        setPhase('typing')
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reduced, shownCommand])

  // Type the command once the terminal is on screen.
  useEffect(() => {
    if (phase !== 'typing' || !shownCommand) return
    if (typed >= shownCommand.length) {
      setPhase('done')
      return
    }
    const step = setTimeout(() => setTyped((count) => count + 1), 38)
    return () => clearTimeout(step)
  }, [phase, typed, shownCommand])

  async function runPing() {
    setChecking(true)
    setLatency({})
    // One server at a time: concurrent probes share the browser's sockets and
    // queue behind each other, which inflates the numbers.
    const next: LatencyMap = {}
    for (const item of SERVERS) {
      next[item.id] = await measure(item.host)
      setLatency({ ...next })
    }
    writePingCache(next)
    setChecking(false)
  }

  // Measure once on load, unless a fresh cache is available.
  const autoPinged = useRef(false)
  useEffect(() => {
    if (autoPinged.current) return
    autoPinged.current = true
    const cached = readPingCache()
    if (cached) {
      setLatency(cached)
      return
    }
    runPing()
  }, [])

  async function onCopy() {
    if (!command) return
    if (await copyText(command)) {
      setCopyState(null)
      setCopied(true)
      clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 4000)
      return
    }
    setCopyState('error')
    clearTimeout(copyTimer.current)
    copyTimer.current = setTimeout(() => setCopyState(null), 4000)
  }

  return (
    <section id="configure" className="border-b border-line">
      <div className={`${CONTAINER} ${SECTION} reveal`}>
        <div className="mb-6 max-w-[44em]">
          <h2 className="text-[28px] font-medium leading-[1.15] tracking-[-0.025em] sm:text-[32px] lg:text-[40px]">
            Build your tunnel command
          </h2>
          <p className="mt-2 text-muted">
            Choose a server and forwarding mode, enter your local service details, then run the generated
            command in your terminal.
          </p>
        </div>

        <div className="rounded-md border border-line bg-surface p-5 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="flex flex-col gap-6">
              <LocationMap
                selected={serverId}
                onSelect={setServerId}
                latency={latency}
                checking={checking}
                onCheckPing={runPing}
              />

              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-ink">Forwarding mode</legend>
                <div className="relative flex gap-1 rounded-sm bg-subtle p-1">
                  {/* shortcut: the thumb spans one of three equal slots; update the calc if a fourth mode arrives. */}
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-1 left-1 top-1 w-[calc((100%-1rem)/3)] rounded-sm bg-ink transition-[translate] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      mode === 'tcp' ? 'translate-x-[calc(100%+0.25rem)]' : 'translate-x-0'
                    }`}
                  />
                  {MODES.map((item) => (
                    <label key={item.id} className="relative z-10 flex flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="mode"
                        value={item.id}
                        checked={mode === item.id}
                        onChange={() => setMode(item.id)}
                        className="peer sr-only"
                      />
                      <span className={SEGMENT}>{item.label}</span>
                    </label>
                  ))}

                  <div className="group relative z-10 flex flex-1">
                    <button
                      type="button"
                      aria-disabled="true"
                      aria-describedby="custom-domain-tip"
                      className={LOCKED_SEGMENT}
                    >
                      Custom domain
                      <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" focusable="false">
                        <rect x="5" y="10.5" width="14" height="9.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                    </button>
                    <span
                      id="custom-domain-tip"
                      role="tooltip"
                      className="pointer-events-none absolute bottom-[calc(100%+8px)] right-0 z-20 w-max max-w-[15rem] rounded-sm bg-ink px-2.5 py-1.5 text-left text-[12px] font-medium leading-snug text-on-ink opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
                    >
                      Custom domains are disabled for now.
                    </span>
                  </div>
                </div>
              </fieldset>

              {mode === 'tcp' && (
                <div className="animate-field-in">
                  <label htmlFor="server-port" className="mb-2 block text-sm font-semibold text-ink">
                    Server port
                  </label>
                  <input
                    id="server-port"
                    type="number"
                    inputMode="numeric"
                    min={TCP_MIN}
                    max={TCP_MAX}
                    value={serverPort}
                    onChange={(event) => setServerPort(event.target.value)}
                    aria-invalid={Boolean(serverPortError)}
                    aria-describedby={serverPortError ? 'server-port-error' : 'server-port-hint'}
                    className={`min-h-12 w-full rounded-sm border bg-surface px-3 text-base text-ink focus:border-action ${
                      serverPortError ? 'border-error' : 'border-muted'
                    }`}
                  />
                  {serverPortError ? (
                    <p id="server-port-error" role="alert" className="mt-1.5 text-[13px] font-medium text-error">
                      {serverPortError}
                    </p>
                  ) : (
                    <p id="server-port-hint" className="mt-1.5 text-[13px] text-muted">
                      Allowed range {TCP_MIN}–{TCP_MAX}.
                    </p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="local-port" className="mb-2 block text-sm font-semibold text-ink">
                  Local port
                </label>
                <input
                  id="local-port"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="65535"
                  value={localPort}
                  onChange={(event) => setLocalPort(event.target.value)}
                  aria-invalid={Boolean(localPortError)}
                  aria-describedby={localPortError ? 'local-port-error' : 'local-port-hint'}
                  className={`min-h-12 w-full rounded-sm border bg-surface px-3 text-base text-ink focus:border-action ${
                    localPortError ? 'border-error' : 'border-muted'
                  }`}
                />
                {localPortError ? (
                  <p id="local-port-error" role="alert" className="mt-1.5 text-[13px] font-medium text-error">
                    {localPortError}
                  </p>
                ) : (
                  <p id="local-port-hint" className="mt-1.5 text-[13px] text-muted">
                    The port your service listens on locally.
                  </p>
                )}
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-3">
              <div ref={terminalRef} className="terminal rounded-md border border-line bg-term p-5 text-term-text">
                <div className="flex items-center gap-2 border-b border-term-text/15 pb-3">
                  <span aria-hidden="true" className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-term-text/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-term-text/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-term-text/20" />
                  </span>
                  <span className="ml-1 font-mono text-[12px] text-term-text/55">bash</span>
                  <span className="ml-auto truncate text-[12px] text-term-text/65">
                    {command
                      ? `${server.city} · ${mode === 'tcp' ? 'TCP' : 'HTTPS'} · local port ${localPort}`
                      : 'Previous valid command'}
                  </span>
                </div>

                <pre className="mt-3 overflow-x-auto rounded-sm border border-term-text/15 bg-black/25 px-3.5 py-3 font-mono text-[13px] leading-relaxed">
                  <code>
                    <span className="text-go">$ </span>
                    {phase === 'done' ? shownCommand : shownCommand?.slice(0, typed)}
                    {phase !== 'done' && (
                      <span aria-hidden="true" className="caret text-term-text/70">
                        ▌
                      </span>
                    )}
                  </code>
                </pre>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className={BTN_TERM} onClick={onCopy} disabled={!command}>
                    Copy command
                  </button>
                </div>

                <p key={copyState} className="mt-3 min-h-[1.6em] animate-pop text-[13px] text-term-text/85" role="status">
                  {copyState === 'error' && 'Copy failed. Select the command and copy it manually.'}
                </p>
              </div>

              <CopiedToast open={copied} command={shownCommand ?? ''} />

              <p className="text-[13px] leading-relaxed text-muted">
                Run this in your terminal. After connecting, use the public address printed there. Closing the
                SSH session removes the tunnel.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4 max-w-[44em] text-sm text-muted">
          HTTPS and TCP tunnels need no registration. Custom domains are disabled for now.
        </p>
      </div>
    </section>
  )
}
