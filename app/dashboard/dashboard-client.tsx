"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import TunnelConfig, { type TunnelConfig as TunnelConfigType, type Server } from "@/components/tunnel-config"
import { authClient } from "@/lib/auth-client"

const defaultConfig: TunnelConfigType = {
  type: "http",
  serverPort: 443,
  localPort: 8000,
}

const formatStartedAgo = (timestamp?: ApiTimestamp): string | undefined => {
  if (!timestamp) return undefined
  const startedMs = timestamp.seconds * 1000 + Math.floor(timestamp.nanos / 1_000_000)
  const diffSeconds = Math.max(0, Math.floor((Date.now() - startedMs) / 1000))

  if (diffSeconds < 60) return `${diffSeconds}s ago`
  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

const toActiveConnection = (session: ApiSession): ActiveConnection => {
  const startedAgo = formatStartedAgo(session.started_at)

  return {
    id: session.slug || `${session.node}-${session.started_at?.seconds ?? Date.now()}`,
    name: session.slug || session.node || "Unknown tunnel",
    status: session.active ? "connected" : "error",
    protocol: (session.forwarding_type || "http").toLowerCase(),
    serverLabel: session.node || "Unknown node",
    remote: session.slug ? `${session.slug}.${session.node}` : session.node || "—",
    startedAgo,
    latencyMs: null,
    dataInOut: undefined,
  }
}

type ApiTimestamp = {
  seconds: number
  nanos: number
}

type ApiSession = {
  node: string
  forwarding_type: "HTTP" | "HTTPS" | "TCP" | string
  slug: string
  user_id: string
  active: boolean
  started_at?: ApiTimestamp
}

type ApiSessionList = ApiSession[]

type SessionResponse = Awaited<ReturnType<typeof authClient.getSession>>

interface DashboardClientProps {
  initialActiveConnections: ApiSessionList
}

type ActiveConnectionStatus = "connected" | "pending" | "error"

type ActiveConnection = {
  id: string
  name: string
  status: ActiveConnectionStatus
  protocol: string
  serverLabel: string
  remote: string
  localPort?: number
  serverPort?: number
  startedAgo?: string
  latencyMs?: number | null
  dataInOut?: string
}

export default function DashboardClient({ initialActiveConnections }: DashboardClientProps) {
  const router = useRouter()
  const [selectedServer, setSelectedServer] = useState<Server | null>(null)
  const [tunnelConfig, setTunnelConfig] = useState<TunnelConfigType>(defaultConfig)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [activeConnections, setActiveConnections] = useState<ActiveConnection[]>(
    initialActiveConnections.map(toActiveConnection),
  )
  const { data: cachedSession } = authClient.useSession()
  const [session, setSession] = useState<SessionResponse["data"] | null>(cachedSession ?? null)

  useEffect(() => {
    setActiveConnections(initialActiveConnections.map(toActiveConnection))
  }, [initialActiveConnections])

  useEffect(() => {
    if (!session && cachedSession) {
      setSession(cachedSession)
    }
  }, [cachedSession, session])

  const stopConnection = (id: string) => {
    setActiveConnections((prev) => prev.filter((conn) => conn.id !== id))
    setStatusMessage("Connection stopped")
  }

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Active Forwarding</h1>
          <p className="text-sm text-gray-400">Live tunnels for this session.</p>
        </div>

        {statusMessage && (
          <div className="rounded-lg border border-emerald-700 bg-emerald-900/40 px-4 py-3 text-sm text-emerald-200">
            {statusMessage}
          </div>
        )}

        <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Active Connections</h2>
              <p className="text-sm text-gray-400">Monitor and manage your running tunnels</p>
            </div>
            <button
              type="button"
              onClick={() => router.refresh()}
              className="text-sm text-emerald-400 hover:text-emerald-300"
            >
              Refresh
            </button>
          </div>

          {activeConnections.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-700 bg-gray-800/60 p-6 text-center text-gray-400">
              No active connections yet. Configure a tunnel to see it here.
            </div>
          ) : (
            <div className="space-y-3">
              {activeConnections.map((connection) => {
                const metaParts: string[] = []
                if (connection.localPort && connection.serverPort) {
                  metaParts.push(`Local ${connection.localPort} → Server ${connection.serverPort}`)
                }
                if (connection.startedAgo) {
                  metaParts.push(connection.startedAgo)
                }
                const metaText = metaParts.length > 0 ? metaParts.join(" · ") : "No session metadata yet"

                return (
                  <div
                    key={connection.id}
                    className="rounded-lg border border-gray-800 bg-gray-800/60 p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{connection.name}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            connection.status === "connected"
                              ? "bg-emerald-900/60 text-emerald-300 border border-emerald-700"
                              : connection.status === "pending"
                                ? "bg-yellow-900/60 text-yellow-300 border border-yellow-700"
                                : "bg-red-900/60 text-red-300 border border-red-700"
                          }`}
                        >
                          {connection.status === "connected"
                            ? "Connected"
                            : connection.status === "pending"
                              ? "Reconnecting"
                              : "Error"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">
                        {(connection.protocol || "http").toUpperCase()} · {connection.serverLabel}
                      </p>
                      <p className="text-xs text-gray-400">{connection.remote || "—"}</p>
                      <p className="text-xs text-gray-500">{metaText}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 md:justify-end">
                      <div className="text-right">
                        <p className="text-sm text-gray-300">Latency</p>
                        <p className="text-lg font-semibold text-white">
                          {connection.latencyMs != null ? `${connection.latencyMs}ms` : "—"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-300">Data</p>
                        <p className="text-lg font-semibold text-white">{connection.dataInOut || "—"}</p>
                      </div>
                      <button
                        onClick={() => stopConnection(connection.id)}
                        className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-200 hover:border-red-500 hover:text-red-200 transition"
                      >
                        Stop
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
          <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Custom Tunnel Configuration</h2>
              <p className="text-sm text-gray-400">Pick a location, test latency, and shape your tunnel exactly how you need.</p>
            </div>
            <Link href="/tunnel-not-found" className="text-sm text-emerald-400 hover:text-emerald-300">
              View docs
            </Link>
          </div>

          <TunnelConfig
            config={tunnelConfig}
            onConfigChange={setTunnelConfig}
            selectedServer={selectedServer}
            onServerSelect={setSelectedServer}
            isAuthenticated={Boolean(session)}
            userId={session?.user?.sshIdentifier}
          />
        </div>
      </div>
    </main>
  )
}
