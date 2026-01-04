"use client"

import { useEffect, useState, type FormEvent } from "react"
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
    node: session.node,
    remote: session.slug ? `${session.slug}.${session.node}` : session.node || "—",
    startedAgo,
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
  node?: string
  remote: string
  localPort?: number
  serverPort?: number
  startedAgo?: string
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
  const [openActionId, setOpenActionId] = useState<string | null>(null)
  const [slugModal, setSlugModal] = useState<{
    connectionId: string
    currentSlug: string
    newSlug: string
    node: string
  } | null>(null)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [slugSaving, setSlugSaving] = useState(false)

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
    setOpenActionId((current) => (current === id ? null : current))
  }

  const openChangeSlugModal = (connection: ActiveConnection) => {
    setSlugModal({
      connectionId: connection.id,
      currentSlug: connection.name,
      newSlug: connection.name,
      node: connection.node || connection.serverLabel,
    })
    setSlugError(null)
    setOpenActionId(null)
  }

  const closeSlugModal = () => setSlugModal(null)

  const validateSlug = (value: string): string | null => {
    const trimmed = value.trim().toLowerCase()
    if (trimmed.length < 3 || trimmed.length > 20) return "Slug must be 3-20 characters."
    if (!/^[a-z0-9-]+$/.test(trimmed)) return "Only lowercase letters, numbers, and hyphens are allowed."
    if (trimmed.startsWith("-") || trimmed.endsWith("-")) return "No leading or trailing hyphens."
    return null
  }

  const submitSlugChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!slugModal) return

    const trimmedSlug = slugModal.newSlug.trim().toLowerCase()
    const validationError = validateSlug(trimmedSlug)
    setSlugError(validationError)
    if (validationError) return

    setSlugSaving(true)
    setStatusMessage(null)

    try {
      const response = await fetch(`/api/session/${slugModal.node}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ old: slugModal.currentSlug, new: trimmedSlug }),
      })

      if (!response.ok) {
        const message = await response.text()
        setSlugError(message || "Failed to update slug.")
        return
      }

      setActiveConnections((prev) =>
        prev.map((conn) =>
          conn.id === slugModal.connectionId
            ? {
                ...conn,
                name: trimmedSlug,
                remote: conn.node ? `${trimmedSlug}.${conn.node}` : trimmedSlug,
              }
            : conn,
        ),
      )

      setStatusMessage("Slug updated")
      setSlugModal(null)
    } catch (error) {
      console.error("Failed to update slug", error)
      setSlugError("Failed to update slug.")
    } finally {
      setSlugSaving(false)
    }
  }

  useEffect(() => {
    if (slugModal) {
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = previousOverflow
      }
    }
  }, [slugModal])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenActionId(null)
        setSlugModal(null)
      }
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [])

  const slugModalContent = !slugModal
    ? null
    : (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Change slug</h3>
                <p className="text-sm text-gray-400">Update the identifier for this tunnel.</p>
              </div>
              <button
                onClick={closeSlugModal}
                className="text-gray-400 hover:text-gray-200"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={submitSlugChange} className="mt-4 space-y-4">
              <label className="block text-sm text-gray-300">
                New slug
                <input
                  type="text"
                  value={slugModal.newSlug}
                  onChange={(e) => {
                    const nextValue = e.target.value.toLowerCase()
                    setSlugModal((prev) => (prev ? { ...prev, newSlug: nextValue } : prev))
                    setSlugError(validateSlug(nextValue))
                  }}
                  className="mt-2 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  placeholder={slugModal.currentSlug}
                />
                {slugError && <p className="mt-2 text-sm text-red-400">{slugError}</p>}
              </label>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeSlugModal}
                  className="rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-200 hover:border-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={Boolean(slugError) || slugSaving}
                  className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {slugSaving ? "Saving..." : "Save slug"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )

  return (
    <>
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
                      {(() => {
                        const isTcp = connection.protocol === "tcp"
                        const isHttp = connection.protocol === "http" || connection.protocol === "https"
                        const httpRemote = connection.remote ? `https://${connection.remote}` : "—"
                        const tcpRemote =
                          connection.node && connection.name
                            ? `tcp://${connection.node}:${connection.name}`
                            : connection.remote || "—"

                        const displayRemote = isTcp ? tcpRemote : isHttp ? httpRemote : connection.remote || "—"

                        return <p className="text-xs text-gray-400">{displayRemote}</p>
                      })()}
                      <p className="text-xs text-gray-500">{metaText}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 md:justify-end relative">
                      <button
                        onClick={() =>
                          setOpenActionId((current) => (current === connection.id ? null : connection.id))
                        }
                        className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-200 hover:border-gray-500 transition"
                      >
                        Actions
                      </button>

                      {openActionId === connection.id && (
                        <div className="absolute right-0 top-12 z-10 w-44 rounded-md border border-gray-700 bg-gray-800 shadow-lg">
                          <button
                            className="w-full px-3 py-2 text-left text-sm text-gray-200 hover:bg-gray-700"
                            onClick={() => stopConnection(connection.id)}
                          >
                            Stop connection
                          </button>
                          {connection.protocol !== "tcp" && (
                            <button
                                className="w-full px-3 py-2 text-left text-sm text-gray-200 hover:bg-gray-700"
                                onClick={() => openChangeSlugModal(connection)}
                            >
                                Change slug
                            </button>
                            )}
                        </div>
                      )}
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
      {slugModalContent}
    </>
  )
}
