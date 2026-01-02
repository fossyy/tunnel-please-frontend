"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import TunnelConfig, { type TunnelConfig as TunnelConfigType, type Server } from "@/components/tunnel-config"
import UserMenu from "@/components/user-menu"
import { authClient } from "@/lib/auth-client"

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

  const handleSignOut = async () => {
    try {
      await authClient.signOut()
      setSession(null)
    } catch (error) {
      console.error("Error signing out", error)
    }
  }

  const stopConnection = (id: string) => {
    setActiveConnections((prev) => prev.filter((conn) => conn.id !== id))
    setStatusMessage("Connection stopped")
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width={20} height={18}>
                <path
                  d="M8.52 4c.296.02.574.086.863.164.09.027.18.05.27.074.066.02.066.02.132.035.29.079.578.149.871.211.332.075.66.153.989.235.492.125.984.246 1.48.355.344.078.684.16 1.027.246.11.028.215.051.325.078.402.098.8.196 1.203.297l.953.235c.023.008.05.011.074.02.16.038.32.073.48.109 1.305.285 1.305.285 1.688.52.031.015.059.034.09.054.262.168.422.37.586.637l.047.074c.238.414.187 1.015.187 1.48v1.649c0 .609-.023 1.144-.445 1.613-.39.367-.871.52-1.367.684-.059.02-.118.039-.18.062-.086.027-.168.059-.254.086-.176.059-.348.121-.523.184a8.12 8.12 0 0 1-.52.175c-.164.051-.324.114-.484.172-.102.04-.2.07-.301.102-.262.078-.52.168-.774.261-.652.231-1.308.458-1.964.68-.2.067-.399.133-.598.203a249.724 249.724 0 0 1-1.176.403c-.136.047-.273.093-.41.136-.05.02-.101.036-.156.055-.067.024-.137.047-.207.07-.04.012-.082.028-.121.04-.098.023-.098.023-.211-.016V12.69c.691-.175.691-.175.937-.23.028-.004.055-.012.086-.016.086-.02.176-.039.266-.058l.191-.04c.387-.085.774-.163 1.16-.238.356-.066.707-.144 1.059-.222.352-.078.703-.153 1.059-.215.355-.067.71-.137 1.062-.215.043-.008.086-.02.133-.027.515-.098.515-.098.918-.414.172-.278.152-.59.152-.91V9.98c.004-.09.004-.175.004-.261v-.657c.004-.039.004-.078.004-.117 0-.308-.05-.597-.203-.867-.067-.047-.067-.047-.149-.078l-.082-.04a.575.575 0 0 0-.086-.038l-.082-.04a1.447 1.447 0 0 0-.46-.093c-.036-.004-.07-.004-.106-.008-.039-.004-.074-.008-.113-.008a17.593 17.593 0 0 1-.766-.082c-.336-.043-.672-.062-1.012-.086-.261-.015-.52-.039-.777-.066-.344-.039-.687-.062-1.035-.082-.348-.023-.7-.05-1.047-.086-.332-.031-.668-.047-1-.062a4.771 4.771 0 0 1-.187-.61c-.207-.879-.653-1.832-1.356-2.41-.11-.098-.11-.098-.144-.207V4Zm0 0"
                  style={{
                    stroke: "none",
                    fillRule: "nonzero",
                    fill: "#f4f0ed",
                    fillOpacity: 1,
                  }}
                />
                <path
                  d="M7.129 3.652c.035.016.035.016.07.035 1.043.481 1.867 1.415 2.285 2.5.27.743.27.743.196 1.083-.028-.004-.055-.004-.086-.008a49.636 49.636 0 0 0-1.864-.11c-.011-.02-.02-.043-.03-.066-.34-.82-.34-.82-.985-1.395v-.074l-.098-.035a3.2 3.2 0 0 1-.336-.14c-.62-.266-1.363-.243-1.988-.008-.79.332-1.242.941-1.586 1.722-.148.442-.129.934-.129 1.399 0 .066 0 .136-.004.207v.558c0 .2 0 .395-.004.59 0 .371-.004.738-.004 1.11 0 .421-.003.843-.003 1.265l-.012 2.598-.446.094c-.062.011-.062.011-.128.027-.86.176-.86.176-1.227.226-.09-.136-.086-.238-.086-.398V12.059c.004-.391 0-.778 0-1.164V8.53c0-.582.012-1.187.168-1.75.008-.031.016-.058.023-.09a4.958 4.958 0 0 1 1.36-2.23h.074l.04-.113h.108c.012-.024.02-.047.028-.07.058-.106.117-.137.219-.196.144-.086.144-.086.289-.176 1.195-.808 2.879-.836 4.156-.254Zm0 0"
                  style={{
                    stroke: "none",
                    fillRule: "nonzero",
                    fill: "#f2efec",
                    fillOpacity: 1,
                  }}
                />
                <path
                  d="M12.488 7.957h.14c.13 0 .259.012.392.023a51.951 51.951 0 0 0 .996.07l.53.036.884.059c.093.007.191.011.289.02.133.007.27.019.406.026.043.004.082.008.125.008.059.004.059.004.113.012.051 0 .051 0 .102.004.082.015.082.015.195.094v.074l.113.039c.047.101.043.176.043.289 0 .043.004.086.004.133 0 .203.004.402.004.605 0 .106 0 .211.004.317 0 .156 0 .308.004.46v.145c0 .328 0 .328-.105.484a1.149 1.149 0 0 1-.504.192l-.075.012-.234.035c-.055.008-.113.015-.168.027-.36.055-.723.11-1.082.16-.176.028-.355.051-.531.078-.028.004-.059.012-.086.016-.18.027-.36.055-.54.086-.105.02-.214.035-.323.055-.055.007-.106.02-.16.027-.079.012-.153.027-.231.039-.063.012-.063.012-.133.023-.25.02-.422-.02-.613-.183-.149-.2-.156-.395-.156-.637v-.156c0-.055-.004-.11-.004-.164V8.59c.011-.203.047-.352.175-.508.149-.129.231-.125.426-.125ZM14.523 9.5a.528.528 0 0 0 0 .379c.07.094.07.094.204.125.132.008.132.008.222-.063a.594.594 0 0 0 .098-.363c-.05-.117-.05-.117-.149-.195-.164-.028-.27-.012-.375.117Zm1.114-.078c-.09.11-.078.203-.078.344.007.09.007.09.09.156.128.02.128.02.261 0 .098-.082.11-.137.13-.27-.009-.117-.009-.117-.083-.207-.113-.082-.191-.078-.32-.023Zm-2.317.156c-.043.125-.062.211-.008.34.051.074.051.074.16.16a.518.518 0 0 0 .352-.101c.086-.133.09-.247.059-.399-.055-.101-.055-.101-.149-.156-.187-.031-.289.012-.414.156Zm0 0"
                  style={{
                    stroke: "none",
                    fillRule: "nonzero",
                    fill: "#5aa680",
                    fillOpacity: 1,
                  }}
                />
                <path
                  d="M9.68 12.77v2.808c-.293.129-.293.129-.414.172-.024.008-.051.016-.079.027-.027.008-.054.02-.082.028l-.09.03a3.392 3.392 0 0 1-.183.063c-.062.024-.125.047-.187.067-.09.031-.18.066-.274.098-.027.007-.055.019-.082.027a.613.613 0 0 1-.41.027v-2.965a7.29 7.29 0 0 1 .695-.183c.028-.008.059-.012.086-.02l.18-.035c.09-.02.18-.035.27-.055l.175-.035c.024-.004.05-.011.078-.015.11-.024.207-.04.317-.04Zm0 0"
                  style={{
                    stroke: "none",
                    fillRule: "nonzero",
                    fill: "#f4f0ee",
                    fillOpacity: 1,
                  }}
                />
                <path
                  d="M6.703 9.59h3.133c.164.004.234.008.371.117.074.102.074.102.098.219-.024.113-.024.113-.098.195-.16.098-.289.094-.473.09H7.082c-.113 0-.23-.004-.344-.004h-.101c-.176 0-.305-.008-.446-.129-.043-.133-.043-.133-.039-.27.157-.222.305-.222.551-.218Zm0 0"
                  style={{
                    stroke: "none",
                    fillRule: "nonzero",
                    fill: "#f7f5f2",
                    fillOpacity: 1,
                  }}
                />
                <path
                  d="M8.145 10.914c.027 0 .058 0 .09-.004h2.097c.094-.004.188 0 .281 0 .043 0 .043 0 .086-.004a.755.755 0 0 1 .446.133c.074.113.074.113.07.25-.031.133-.031.133-.09.2-.133.07-.258.066-.402.066h-.094c-.106 0-.207 0-.313-.004H8.031c-.152-.004-.281-.012-.414-.09-.054-.125-.054-.125-.074-.27.043-.12.078-.171.191-.234.137-.043.266-.047.41-.043Zm0 0"
                  style={{
                    stroke: "none",
                    fillRule: "nonzero",
                    fill: "#edeae7",
                    fillOpacity: 1,
                  }}
                />
                <path
                  d="M8.555 8.324H9.949c.13-.004.254-.004.38-.004h.577c.16.032.215.09.313.22.004.12.004.12-.035.23-.09.093-.145.113-.27.128h-.144c-.04.004-.04.004-.079.004H9.02c-.06 0-.118 0-.176.004-.086 0-.168 0-.25-.004h-.145c-.14-.02-.183-.054-.27-.172-.015-.125-.015-.199.044-.312.105-.105.187-.09.332-.094Zm0 0"
                  style={{
                    stroke: "none",
                    fillRule: "nonzero",
                    fill: "#eeebe9",
                    fillOpacity: 1,
                  }}
                />
                <path
                  d="M10.094 9.77c.062.011.125.023.187.039a.757.757 0 0 1 0 .23.431.431 0 0 1-.265.168c-.094.004-.188.004-.282.004H9.02c-.176 0-.348 0-.52-.004H7.074c-.117-.004-.23-.004-.344-.004H6.45c-.07-.012-.07-.012-.183-.086l3.828-.039v-.117h-.074v-.078h.074V9.77Zm0 0"
                  style={{
                    stroke: "none",
                    fillRule: "nonzero",
                    fill: "#9d9c9b",
                    fillOpacity: 1,
                  }}
                />
                <path
                  d="M8.52 4c.335.016.648.105.972.191v.04h-.336c-.004.042-.011.085-.015.128-.024.141-.024.141-.098.22.05.023.098.05.148.073-.023.04-.046.078-.074.118-.031-.036-.058-.07-.094-.106-.039-.043-.082-.09-.12-.137l-.063-.066c-.02-.024-.04-.043-.059-.066-.02-.024-.039-.043-.058-.067a2.522 2.522 0 0 0-.145-.144C8.52 4.117 8.52 4.117 8.52 4Zm0 0"
                  style={{
                    stroke: "none",
                    fillRule: "nonzero",
                    fill: "#d2cfce",
                    fillOpacity: 1,
                  }}
                />
                <path
                  d="M6.34 9.617c.488-.004.976-.008 1.46-.008.227 0 .454 0 .68-.004h.653c.082 0 .168 0 .25-.003H9.836c.234 0 .234 0 .355.074.028.027.028.027.051.054l-.035.079c-.05-.012-.102-.028-.152-.04v-.078c-1.223-.011-2.45-.023-3.715-.039v-.035Zm0 0"
                  style={{
                    stroke: "none",
                    fillRule: "nonzero",
                    fill: "#d9d5d6",
                    fillOpacity: 1,
                  }}
                />
                <path
                  d="m13.707 11.324.102.012.074.012c-.2.117-.434.129-.66.164-.082.015-.164.027-.246.043l-.16.023-.145.024c-.14.015-.262 0-.402-.024l-.036-.117c.07.004.07.004.145.004.195 0 .383-.027.574-.059.035-.004.067-.011.102-.015.125-.02.246-.04.37-.07a.97.97 0 0 1 .282.003Zm0 0"
                  style={{
                    stroke: "none",
                    fillRule: "nonzero",
                    fill: "#589275",
                    fillOpacity: 1,
                  }}
                />
                <path
                  d="M8.145 10.914h2.558c.152 0 .27.016.402.086-.14.047-.273.043-.421.043H9.473c-.196-.004-.391-.004-.586-.004H7.73c-.011.04-.027.074-.039.113a1.343 1.343 0 0 0-.074-.035c.04-.117.04-.117.113-.164.141-.039.27-.039.415-.039Zm0 0"
                  style={{
                    stroke: "none",
                    fillRule: "nonzero",
                    fill: "#c5c4c3",
                    fillOpacity: 1,
                  }}
                />
                <path
                  d="M11.145 8.46c.035.04.035.04.074.08-.004.124-.012.202-.098.292-.121.07-.215.066-.351.066H9.387c-.125 0-.25 0-.375-.003H8.44c-.109-.012-.109-.012-.187-.086h2.742c.004-.082.004-.082-.039-.157h.148c.016-.062.028-.125.04-.191Zm0 0"
                  style={{
                    stroke: "none",
                    fillRule: "nonzero",
                    fill: "#bbbab9",
                    fillOpacity: 1,
                  }}
                />
                <path
                  d="M7.953 13.117c.027.012.05.024.078.035-.039.016-.074.028-.113.04l.035 2.886c.102-.015.2-.027.3-.039-.1.106-.19.102-.335.113-.063-.062-.043-.144-.043-.23v-.657c0-.175 0-.35.004-.527v-1.585c.027-.012.05-.024.074-.036Zm0 0"
                  style={{
                    stroke: "none",
                    fillRule: "nonzero",
                    fill: "#999896",
                    fillOpacity: 1,
                  }}
                />
              </svg>
              <span className="text-xl font-bold">
                <span className="text-emerald-400">tunnl</span>.live
              </span>
            </div>

            <div className="flex items-center gap-4">
              {session?.user ? (
                <UserMenu
                  user={{
                    name: session.user.name ?? "User",
                    email: session.user.email ?? "",
                    image: session.user.image ?? undefined,
                  }}
                  onSignOut={handleSignOut}
                />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" x2="3" y1="12" y2="12" />
                    </svg>
                    Sign In
                  </Link>

                  <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-emerald-400"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                    <span>Sign in to save configurations & view history</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

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

      <footer className="border-t border-gray-800 py-6 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={18}>
              <path
                d="M8.52 4c.296.02.574.086.863.164.09.027.18.05.27.074.066.02.066.02.132.035.29.079.578.149.871.211.332.075.66.153.989.235.492.125.984.246 1.48.355.344.078.684.16 1.027.246.11.028.215.051.325.078.402.098.8.196 1.203.297l.953.235c.023.008.05.011.074.02.16.038.32.073.48.109 1.305.285 1.305.285 1.688.52.031.015.059.034.09.054.262.168.422.37.586.637l.047.074c.238.414.187 1.015.187 1.48v1.649c0 .609-.023 1.144-.445 1.613-.39.367-.871.52-1.367.684-.059.02-.118.039-.18.062-.086.027-.168.059-.254.086-.176.059-.348.121-.523.184a8.12 8.12 0 0 1-.52.175c-.164.051-.324.114-.484.172-.102.04-.2.07-.301.102-.262.078-.52.168-.774.261-.652.231-1.308.458-1.964.68-.2.067-.399.133-.598.203a249.724 249.724 0 0 1-1.176.403c-.136.047-.273.093-.41.136-.05.02-.101.036-.156.055-.067.024-.137.047-.207.07-.04.012-.082.028-.121.04-.098.023-.098.023-.211-.016V12.69c.691-.175.691-.175.937-.23.028-.004.055-.012.086-.016.086-.02.176-.039.266-.058l.191-.04c.387-.085.774-.163 1.16-.238.356-.066.707-.144 1.059-.222.352-.078.703-.153 1.059-.215.355-.067.71-.137 1.062-.215.043-.008.086-.02.133-.027.515-.098.515-.098.918-.414.172-.278.152-.59.152-.91V9.98c.004-.09.004-.175.004-.261v-.657c.004-.039.004-.078.004-.117 0-.308-.05-.597-.203-.867-.067-.047-.067-.047-.149-.078l-.082-.04a.575.575 0 0 0-.086-.038l-.082-.04a1.447 1.447 0 0 0-.46-.093c-.036-.004-.07-.004-.106-.008-.039-.004-.074-.008-.113-.008a17.593 17.593 0 0 1-.766-.082c-.336-.043-.672-.062-1.012-.086-.261-.015-.52-.039-.777-.066-.344-.039-.687-.062-1.035-.082-.348-.023-.7-.05-1.047-.086-.332-.031-.668-.047-1-.062a4.771 4.771 0 0 1-.187-.61c-.207-.879-.653-1.832-1.356-2.41-.11-.098-.11-.098-.144-.207V4Zm0 0"
                style={{
                  stroke: "none",
                  fillRule: "nonzero",
                  fill: "#f4f0ed",
                  fillOpacity: 1,
                }}
              />
              <path
                d="M7.129 3.652c.035.016.035.016.07.035 1.043.481 1.867 1.415 2.285 2.5.27.743.27.743.196 1.083-.028-.004-.055-.004-.086-.008a49.636 49.636 0 0 0-1.864-.11c-.011-.02-.02-.043-.03-.066-.34-.82-.34-.82-.985-1.395v-.074l-.098-.035a3.2 3.2 0 0 1-.336-.14c-.62-.266-1.363-.243-1.988-.008-.79.332-1.242.941-1.586 1.722-.148.442-.129.934-.129 1.399 0 .066 0 .136-.004.207v.558c0 .2 0 .395-.004.59 0 .371-.004.738-.004 1.11 0 .421-.003.843-.003 1.265l-.012 2.598-.446.094c-.062.011-.062.011-.128.027-.86.176-.86.176-1.227.226-.09-.136-.086-.238-.086-.398V12.059c.004-.391 0-.778 0-1.164V8.53c0-.582.012-1.187.168-1.75.008-.031.016-.058.023-.09a4.958 4.958 0 0 1 1.36-2.23h.074l.04-.113h.108c.012-.024.02-.047.028-.07.058-.106.117-.137.219-.196.144-.086.144-.086.289-.176 1.195-.808 2.879-.836 4.156-.254Zm0 0"
                style={{
                  stroke: "none",
                  fillRule: "nonzero",
                  fill: "#f2efec",
                  fillOpacity: 1,
                }}
              />
              <path
                d="M12.488 7.957h.14c.13 0 .259.012.392.023a51.951 51.951 0 0 0 .996.07l.53.036.884.059c.093.007.191.011.289.02.133.007.27.019.406.026.043.004.082.008.125.008.059.004.059.004.113.012.051 0 .051 0 .102.004.082.015.082.015.195.094v.074l.113.039c.047.101.043.176.043.289 0 .043.004.086.004.133 0 .203.004.402.004.605 0 .106 0 .211.004.317 0 .156 0 .308.004.46v.145c0 .328 0 .328-.105.484a1.149 1.149 0 0 1-.504.192l-.075.012-.234.035c-.055.008-.113.015-.168.027-.36.055-.723.11-1.082.16-.176.028-.355.051-.531.078-.028.004-.059.012-.086.016-.18.027-.36.055-.54.086-.105.02-.214.035-.323.055-.055.007-.106.02-.16.027-.079.012-.153.027-.231.039-.063.012-.063.012-.133.023-.25.02-.422-.02-.613-.183-.149-.2-.156-.395-.156-.637v-.156c0-.055-.004-.11-.004-.164V8.59c.011-.203.047-.352.175-.508.149-.129.231-.125.426-.125ZM14.523 9.5a.528.528 0 0 0 0 .379c.07.094.07.094.204.125.132.008.132.008.222-.063a.594.594 0 0 0 .098-.363c-.05-.117-.05-.117-.149-.195-.164-.028-.27-.012-.375.117Zm1.114-.078c-.09.11-.078.203-.078.344.007.09.007.09.09.156.128.02.128.02.261 0 .098-.082.11-.137.13-.27-.009-.117-.009-.117-.083-.207-.113-.082-.191-.078-.32-.023Zm-2.317.156c-.043.125-.062.211-.008.34.051.074.051.074.16.16a.518.518 0 0 0 .352-.101c.086-.133.09-.247.059-.399-.055-.101-.055-.101-.149-.156-.187-.031-.289.012-.414.156Zm0 0"
                style={{
                  stroke: "none",
                  fillRule: "nonzero",
                  fill: "#5aa680",
                  fillOpacity: 1,
                }}
              />
              <path
                d="M9.68 12.77v2.808c-.293.129-.293.129-.414.172-.024.008-.051.016-.079.027-.027.008-.054.02-.082.028l-.09.03a3.392 3.392 0 0 1-.183.063c-.062.024-.125.047-.187.067-.09.031-.18.066-.274.098-.027.007-.055.019-.082.027a.613.613 0 0 1-.41.027v-2.965a7.29 7.29 0 0 1 .695-.183c.028-.008.059-.012.086-.02l.18-.035c.09-.02.18-.035.27-.055l.175-.035c.024-.004.05-.011.078-.015.11-.024.207-.04.317-.04Zm0 0"
                style={{
                  stroke: "none",
                  fillRule: "nonzero",
                  fill: "#f4f0ee",
                  fillOpacity: 1,
                }}
              />
              <path
                d="M6.703 9.59h3.133c.164.004.234.008.371.117.074.102.074.102.098.219-.024.113-.024.113-.098.195-.16.098-.289.094-.473.09H7.082c-.113 0-.23-.004-.344-.004h-.101c-.176 0-.305-.008-.446-.129-.043-.133-.043-.133-.039-.27.157-.222.305-.222.551-.218Zm0 0"
                style={{
                  stroke: "none",
                  fillRule: "nonzero",
                  fill: "#f7f5f2",
                  fillOpacity: 1,
                }}
              />
              <path
                d="M8.145 10.914c.027 0 .058 0 .09-.004h2.097c.094-.004.188 0 .281 0 .043 0 .043 0 .086-.004a.755.755 0 0 1 .446.133c.074.113.074.113.07.25-.031.133-.031.133-.09.2-.133.07-.258.066-.402.066h-.094c-.106 0-.207 0-.313-.004H8.031c-.152-.004-.281-.012-.414-.09-.054-.125-.054-.125-.074-.27.043-.12.078-.171.191-.234.137-.043.266-.047.41-.043Zm0 0"
                style={{
                  stroke: "none",
                  fillRule: "nonzero",
                  fill: "#edeae7",
                  fillOpacity: 1,
                }}
              />
              <path
                d="M8.555 8.324H9.949c.13-.004.254-.004.38-.004h.577c.16.032.215.09.313.22.004.12.004.12-.035.23-.09.093-.145.113-.27.128h-.144c-.04.004-.04.004-.079.004H9.02c-.06 0-.118 0-.176.004-.086 0-.168 0-.25-.004h-.145c-.14-.02-.183-.054-.27-.172-.015-.125-.015-.199.044-.312.105-.105.187-.09.332-.094Zm0 0"
                style={{
                  stroke: "none",
                  fillRule: "nonzero",
                  fill: "#eeebe9",
                  fillOpacity: 1,
                }}
              />
              <path
                d="M10.094 9.77c.062.011.125.023.187.039a.757.757 0 0 1 0 .23.431.431 0 0 1-.265.168c-.094.004-.188.004-.282.004H9.02c-.176 0-.348 0-.52-.004H7.074c-.117-.004-.23-.004-.344-.004H6.45c-.07-.012-.07-.012-.183-.086l3.828-.039v-.117h-.074v-.078h.074V9.77Zm0 0"
                style={{
                  stroke: "none",
                  fillRule: "nonzero",
                  fill: "#9d9c9b",
                  fillOpacity: 1,
                }}
              />
              <path
                d="M8.52 4c.335.016.648.105.972.191v.04h-.336c-.004.042-.011.085-.015.128-.024.141-.024.141-.098.22.05.023.098.05.148.073-.023.04-.046.078-.074.118-.031-.036-.058-.07-.094-.106-.039-.043-.082-.09-.12-.137l-.063-.066c-.02-.024-.04-.043-.059-.066-.02-.024-.039-.043-.058-.067a2.522 2.522 0 0 0-.145-.144C8.52 4.117 8.52 4.117 8.52 4Zm0 0"
                style={{
                  stroke: "none",
                  fillRule: "nonzero",
                  fill: "#d2cfce",
                  fillOpacity: 1,
                }}
              />
              <path
                d="M6.34 9.617c.488-.004.976-.008 1.46-.008.227 0 .454 0 .68-.004h.653c.082 0 .168 0 .25-.003H9.836c.234 0 .234 0 .355.074.028.027.028.027.051.054l-.035.079c-.05-.012-.102-.028-.152-.04v-.078c-1.223-.011-2.45-.023-3.715-.039v-.035Zm0 0"
                style={{
                  stroke: "none",
                  fillRule: "nonzero",
                  fill: "#d9d5d6",
                  fillOpacity: 1,
                }}
              />
              <path
                d="m13.707 11.324.102.012.074.012c-.2.117-.434.129-.66.164-.082.015-.164.027-.246.043l-.16.023-.145.024c-.14.015-.262 0-.402-.024l-.036-.117c.07.004.07.004.145.004.195 0 .383-.027.574-.059.035-.004.067-.011.102-.015.125-.02.246-.04.37-.07a.97.97 0 0 1 .282.003Zm0 0"
                style={{
                  stroke: "none",
                  fillRule: "nonzero",
                  fill: "#589275",
                  fillOpacity: 1,
                }}
              />
              <path
                d="M8.145 10.914h2.558c.152 0 .27.016.402.086-.14.047-.273.043-.421.043H9.473c-.196-.004-.391-.004-.586-.004H7.73c-.011.04-.027.074-.039.113a1.343 1.343 0 0 0-.074-.035c.04-.117.04-.117.113-.164.141-.039.27-.039.415-.039Zm0 0"
                style={{
                  stroke: "none",
                  fillRule: "nonzero",
                  fill: "#c5c4c3",
                  fillOpacity: 1,
                }}
              />
              <path
                d="M11.145 8.46c.035.04.035.04.074.08-.004.124-.012.202-.098.292-.121.07-.215.066-.351.066H9.387c-.125 0-.25 0-.375-.003H8.44c-.109-.012-.109-.012-.187-.086h2.742c.004-.082.004-.082-.039-.157h.148c.016-.062.028-.125.04-.191Zm0 0"
                style={{
                  stroke: "none",
                  fillRule: "nonzero",
                  fill: "#bbbab9",
                  fillOpacity: 1,
                }}
              />
              <path
                d="M7.953 13.117c.027.012.05.024.078.035-.039.016-.074.028-.113.04l.035 2.886c.102-.015.2-.027.3-.039-.1.106-.19.102-.335.113-.063-.062-.043-.144-.043-.23v-.657c0-.175 0-.35.004-.527v-1.585c.027-.012.05-.024.074-.036Zm0 0"
                style={{
                  stroke: "none",
                  fillRule: "nonzero",
                  fill: "#999896",
                  fillOpacity: 1,
                }}
              />
            </svg>
            <span className="text-lg font-bold">tunnl.live</span>
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} tunnl.live. Made with ❤️ by{" "}
            <a
              href="https://github.com/fossyy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              Bagas
            </a>. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
