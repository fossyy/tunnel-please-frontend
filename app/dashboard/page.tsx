"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import TunnelConfig, { type TunnelConfig as TunnelConfigType, type Server } from "@/components/tunnel-config"
import { authClient } from "@/lib/auth-client"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

const defaultConfig: TunnelConfigType = {
  type: "http",
  serverPort: 443,
  localPort: 8000,
}

type ActiveConnection = {
  id: string
  name: string
  serverLabel: string
  protocol: TunnelConfigType["type"]
  localPort: number
  serverPort: number
  remote: string
  status: "connected" | "pending" | "error"
  latencyMs: number | null
  dataInOut: string
  startedAgo: string
}

export default function DashboardPage() {
  const [selectedServer, setSelectedServer] = useState<Server | null>(null)
  const [tunnelConfig, setTunnelConfig] = useState<TunnelConfigType>(defaultConfig)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [activeConnections, setActiveConnections] = useState<ActiveConnection[]>([
    {
      id: "conn-1",
      name: "Frontend Preview",
      serverLabel: "Singapore",
      protocol: "http",
      localPort: 3000,
      serverPort: 443,
      remote: "https://sgp.tunnl.live",
      status: "connected",
      latencyMs: 34,
      dataInOut: "1.2 GB",
      startedAgo: "3h 12m",
    },
    {
      id: "conn-2",
      name: "Game TCP",
      serverLabel: "Frankfurt",
      protocol: "tcp",
      localPort: 25565,
      serverPort: 20555,
      remote: "tcp://eu.tunnl.live:20555",
      status: "connected",
      latencyMs: 120,
      dataInOut: "320 MB",
      startedAgo: "54m",
    },
  ])

  type SessionResponse = Awaited<ReturnType<typeof authClient.getSession>>
  const [session, setSession] = useState<SessionResponse["data"] | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const result = await authClient.getSession()
        if (result.data) {
          setSession(result.data)
        }
      } catch (error) {
        console.error("Error fetching session", error)
      }
    }

    fetchSession()
  }, [])

  const stopConnection = (id: string) => {
    setActiveConnections((prev) => prev.filter((conn) => conn.id !== id))
    setStatusMessage("Connection stopped")
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white">
      <SiteHeader />

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
              <Link
                href="/tunnel-not-found"
                className="text-sm text-emerald-400 hover:text-emerald-300"
              >
                View logs
              </Link>
            </div>

            {activeConnections.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-700 bg-gray-800/60 p-6 text-center text-gray-400">
                No active connections yet. Configure a tunnel to see it here.
              </div>
            ) : (
              <div className="space-y-3">
                {activeConnections.map((connection) => (
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
                        {connection.protocol.toUpperCase()} · {connection.serverLabel}
                      </p>
                      <p className="text-xs text-gray-400">{connection.remote}</p>
                      <p className="text-xs text-gray-500">
                        Local {connection.localPort} → Server {connection.serverPort} · {connection.startedAgo}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 md:justify-end">
                      <div className="text-right">
                        <p className="text-sm text-gray-300">Latency</p>
                        <p className="text-lg font-semibold text-white">
                          {connection.latencyMs ? `${connection.latencyMs}ms` : "—"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-300">Data</p>
                        <p className="text-lg font-semibold text-white">{connection.dataInOut}</p>
                      </div>
                      <button
                        onClick={() => stopConnection(connection.id)}
                        className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-200 hover:border-red-500 hover:text-red-200 transition"
                      >
                        Stop
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Custom Tunnel Configuration</h2>
                <p className="text-sm text-gray-400">Pick a location, test latency, and shape your tunnel exactly how you need.</p>
              </div>
              <Link
                href="/tunnel-not-found"
                className="text-sm text-emerald-400 hover:text-emerald-300"
              >
                View docs
              </Link>
            </div>

            <TunnelConfig
              config={tunnelConfig}
              onConfigChange={setTunnelConfig}
              selectedServer={selectedServer}
              onServerSelect={setSelectedServer}
              isAuthenticated={Boolean(session)}
              userId={session?.user?.id}
            />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
