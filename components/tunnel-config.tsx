"use client"

import { useState, useEffect } from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import Link from "next/link"

export interface TunnelConfig {
  type: "http" | "tcp"
  serverPort: number
  localPort: number
}

interface Server {
  id: string
  name: string
  location: string
  subdomain: string
  coordinates: [number, number]
  ping: number | null
  status: "online" | "offline" | "maintenance"
  pingStatus: "idle" | "testing" | "success" | "failed" | "timeout"
  capabilities: {
    http: boolean
    tcp: boolean
  }
  portRestrictions?: {
    allowedRanges?: Array<{ min: number; max: number }>
    blockedPorts?: number[]
    supportsAutoAssign?: boolean
  }
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

interface TunnelConfigProps {
  config: TunnelConfig
  onConfigChange: (config: TunnelConfig) => void
  selectedServer: Server | null
  onServerSelect: (server: Server) => void
  isAuthenticated?: boolean
}

const fetchServers = async (): Promise<Server[]> => {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const mockServers: Server[] = [
    {
      id: "us",
      name: "United States",
      location: "Chicago",
      subdomain: "us.tunnl.live",
      coordinates: [-87.6298, 41.8781],
      ping: null,
      status: "online",
      pingStatus: "idle",
      capabilities: {
        http: true,
        tcp: true,
      },
      portRestrictions: {
        allowedRanges: [
          { min: 20000, max: 21000 },
        ],
        blockedPorts: [8080, 8443, 9000],
        supportsAutoAssign: true,
      },
    },
    {
      id: "fra",
      name: "Frankfurt",
      location: "Germany",
      subdomain: "eu.tunnl.live",
      coordinates: [8.6821, 50.1109],
      ping: null,
      status: "online",
      pingStatus: "idle",
      capabilities: {
        http: true,
        tcp: true,
      },
      portRestrictions: {
        allowedRanges: [
          { min: 20000, max: 21000 },
        ],
        blockedPorts: [8080, 8443, 9000],
        supportsAutoAssign: true,
      },
    },
    {
      id: "sgp",
      name: "Singapore",
      location: "Singapore",
      subdomain: "sgp.tunnl.live",
      coordinates: [103.8198, 1.3521],
      ping: null,
      status: "online",
      pingStatus: "idle",
      capabilities: {
        http: true,
        tcp: true,
      },
      portRestrictions: {
        allowedRanges: [
          { min: 20000, max: 21000 },
        ],
        blockedPorts: [8080, 8443, 9000],
        supportsAutoAssign: true,
      },
    }
  ]

  return mockServers.filter((server) => server.status === "online")
}

const testServerPing = (
  server: Server,
): Promise<{ server: Server; ping: number | null; status: Server["pingStatus"] }> => {
  return new Promise((resolve) => {
    const startTime = Date.now()
    const timeout = 5000
    let resolved = false

    const pingUrl = `https://ping.${server.subdomain}`

    const timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true
        resolve({
          server,
          ping: null,
          status: "timeout",
        })
      }
    }, timeout)

    fetch(pingUrl, {
      method: "HEAD",
      cache: "no-cache",
    })
      .then((res) => {
        if (resolved) return

        resolved = true
        clearTimeout(timeoutId)

        if (!res.ok) {
          resolve({
            server,
            ping: null,
            status: "failed",
          })
          return
        }

        const ping = Date.now() - startTime

        resolve({
          server,
          ping,
          status: "success",
        })
      })
      .catch((err) => {
        if (resolved) return
        resolved = true
        clearTimeout(timeoutId)

        console.error(`HEAD ping error for ${pingUrl}:`, err)
        resolve({
          server,
          ping: null,
          status: "failed",
        })
      })
  })
}

export default function TunnelConfig({
  config,
  onConfigChange,
  selectedServer,
  onServerSelect,
  isAuthenticated = false,
}: TunnelConfigProps) {
  const [localConfig, setLocalConfig] = useState<TunnelConfig>({
    ...config,
    serverPort: config.type === "tcp" ? 0 : config.serverPort,
  })
  const [servers, setServers] = useState<Server[]>([])
  const [isLoadingServers, setIsLoadingServers] = useState(true)
  const [isTestingPings, setIsTestingPings] = useState(false)
  const [hasAutoTested, setHasAutoTested] = useState(false)
  const [copied, setCopied] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [portError, setPortError] = useState<string | null>(null)
  const [pendingServerSelection, setPendingServerSelection] = useState<Server | null>(null)
  const [showTcpLoginPrompt, setShowTcpLoginPrompt] = useState(false)

  useEffect(() => {
    const loadServers = async () => {
      try {
        setIsLoadingServers(true)
        setServerError(null)
        const serverData = await fetchServers()
        setServers(serverData)

        if (serverData.length === 0) {
          setServerError("No servers are currently available. Please try again later.")
        }
      } catch (error) {
        setServerError("Failed to load servers. Please check your connection and try again.")
      } finally {
        setIsLoadingServers(false)
      }
    }

    loadServers()
  }, [])

  useEffect(() => {
    if (servers.length > 0 && !isLoadingServers && !hasAutoTested) {
      const autoTestPings = async () => {
        setIsTestingPings(true)
        setHasAutoTested(true)

        setServers((prevServers) =>
          prevServers.map((server) => ({
            ...server,
            pingStatus: "testing" as const,
          })),
        )

        try {
          const testedServers: Server[] = []

          for (const server of servers) {
            try {
              const result = await testServerPing(server)

              const updatedServer = {
                ...result.server,
                ping: result.ping,
                pingStatus: result.status,
              }

              testedServers.push(updatedServer)

              setServers((prevServers) => prevServers.map((s) => (s.id === server.id ? updatedServer : s)))

              await new Promise((resolve) => setTimeout(resolve, 100))
            } catch (error) {
              console.error(`Error testing ping for ${server.id}:`, error)

              const failedServer = {
                ...server,
                ping: null,
                pingStatus: "timeout" as const,
              }

              testedServers.push(failedServer)

              setServers((prevServers) => prevServers.map((s) => (s.id === server.id ? failedServer : s)))
            }
          }

          const compatibleServers = testedServers.filter(
            (s) =>
              s.pingStatus === "success" &&
              s.ping !== null &&
              s.capabilities.http &&
              ((localConfig.type === "http" && s.capabilities.http) ||
                (localConfig.type === "tcp" && s.capabilities.tcp && isAuthenticated)),
          )

          if (compatibleServers.length > 0) {
            const bestServer = compatibleServers.reduce((prev, current) =>
              prev.ping! < current.ping! ? prev : current,
            )
            setPendingServerSelection(bestServer)
          } else {
            const httpServers = testedServers.filter((s) => s.pingStatus === "success" && s.capabilities.http)
            if (httpServers.length > 0) {
              const bestServer = httpServers.reduce((prev, current) => (prev.ping! < current.ping! ? prev : current))
              setPendingServerSelection(bestServer)
            } else if (testedServers.length > 0) {
              setPendingServerSelection(testedServers[0])
            }
          }
        } catch (error) {
          console.error("Error testing pings:", error)
        } finally {
          setIsTestingPings(false)
        }
      }

      autoTestPings()
    }
  }, [servers, isLoadingServers, hasAutoTested, localConfig.type, isAuthenticated])

  useEffect(() => {
    if (pendingServerSelection) {
      onServerSelect(pendingServerSelection)
      setPendingServerSelection(null)

      if (localConfig.type === "tcp" && (!pendingServerSelection.capabilities.tcp || !isAuthenticated)) {
        updateConfig({ type: "http", serverPort: 443 })
      }
    }
  }, [pendingServerSelection, onServerSelect, localConfig.type, isAuthenticated])

  useEffect(() => {
    if (selectedServer && localConfig.type === "tcp" && localConfig.serverPort !== 0) {
      const error = validatePort(localConfig.serverPort, selectedServer)
      setPortError(error)
    } else {
      setPortError(null)
    }
  }, [selectedServer, localConfig.serverPort, localConfig.type])

  const validatePort = (port: number, server: Server): string | null => {
    if (!server.portRestrictions) return null

    const { allowedRanges, blockedPorts } = server.portRestrictions

    if (blockedPorts && blockedPorts.includes(port)) {
      return `Port ${port} is not available on this server`
    }

    if (allowedRanges && allowedRanges.length > 0) {
      const isInRange = allowedRanges.some((range) => port >= range.min && port <= range.max)
      if (!isInRange) {
        const rangeStrings = allowedRanges.map((r) => `${r.min}-${r.max}`)
        return `Port must be within allowed ranges: ${rangeStrings.join(", ")}`
      }
    }

    if (port < 1024) {
      return `Port ${port} is restricted. Please use a port number 1024 or higher.`
    }

    return null
  }

  const updateConfig = (updates: Partial<TunnelConfig>) => {
    const newConfig = { ...localConfig, ...updates }

    if (updates.serverPort && (updates.serverPort === 80 || updates.serverPort === 443)) {
      newConfig.type = "http"
    }

    setLocalConfig(newConfig)
    onConfigChange(newConfig)
  }

  const handleTcpSelection = () => {
    if (!isAuthenticated) {
      setShowTcpLoginPrompt(true)
      return
    }

    updateConfig({ type: "tcp", serverPort: 0 })
    setShowTcpLoginPrompt(false)
  }

  const generateCommand = () => {
    if (!selectedServer) return ""
    const { serverPort, localPort } = localConfig
    return `ssh ${selectedServer.subdomain} -p 2200 -R ${serverPort}:localhost:${localPort}`
  }

  const copyToClipboard = () => {
    const command = generateCommand()
    if (command) {
      navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getPingColor = (server: Server) => {
    if (server.pingStatus === "testing") return "text-gray-400"
    if (server.pingStatus === "failed" || server.pingStatus === "timeout") return "text-red-400"
    if (server.pingStatus === "idle" || !server.ping) return "text-gray-400"
    if (server.ping < 100) return "text-green-400"
    if (server.ping < 300) return "text-yellow-400"
    if (server.ping < 500) return "text-orange-400"
    if (server.ping < 1000) return "text-red-400"
    return "text-red-400"
  }

  const getPingDisplay = (server: Server) => {
    if (server.pingStatus === "testing") return "Testing..."
    if (server.pingStatus === "timeout") return "Timeout"
    if (server.pingStatus === "failed") return "Failed"
    if (server.pingStatus === "idle") return "Click to test"
    if (server.ping === null) return "N/A"
    return `${server.ping}ms`
  }

  const getPingStatus = (server: Server) => {
    if (server.pingStatus === "testing") return "Testing..."
    if (server.pingStatus === "timeout") return "Timeout (5s)"
    if (server.pingStatus === "failed") return "Connection Failed"
    if (server.pingStatus === "idle") return "Not tested"
    if (!server.ping) return "Unknown"
    if (server.ping < 100) return "Excellent"
    if (server.ping < 300) return "Good"
    if (server.ping < 500) return "Fair"
    if (server.ping < 1000) return "Poor"
    return "Very Poor"
  }

  const getMarkerColor = (server: Server) => {
    if (selectedServer?.id === server.id) return "#10b981"
    if (server.pingStatus === "failed" || server.pingStatus === "timeout") return "#ef4444"
    if (server.pingStatus === "success" && server.ping !== null) {
      if (server.ping < 100) return "#10b981"
      if (server.ping < 300) return "#eab308"
      if (server.ping < 500) return "#f97316"
      if (server.ping < 1000) return "#ef4444"
      return "#ef4444"
    }
    return "#6b7280"
  }

  const getMarkerStroke = (server: Server) => {
    if (selectedServer?.id === server.id) return "#34d399"
    if (server.pingStatus === "failed" || server.pingStatus === "timeout") return "#f87171"
    if (server.pingStatus === "success" && server.ping !== null) {
      if (server.ping < 100) return "#34d399"
      if (server.ping < 300) return "#facc15"
      if (server.ping < 500) return "#fb923c"
      if (server.ping < 1000) return "#f87171"
      return "#f87171"
    }
    return "#9ca3af"
  }

  const testPingForServer = async (server: Server) => {
    setServers((prevServers) =>
      prevServers.map((s) => (s.id === server.id ? { ...s, pingStatus: "testing", ping: null } : s)),
    )

    try {
      const timeoutPromise = new Promise<{ server: Server; ping: number | null; status: Server["pingStatus"] }>(
        (_, reject) => {
          setTimeout(() => reject(new Error("Timeout")), 5000)
        },
      )

      const result = await Promise.race([testServerPing(server), timeoutPromise])

      setServers((prevServers) =>
        prevServers.map((s) => (s.id === server.id ? { ...s, ping: result.ping, pingStatus: result.status } : s)),
      )
    } catch (error) {
      console.error("Error testing ping:", error)
      setServers((prevServers) =>
        prevServers.map((s) => (s.id === server.id ? { ...s, ping: null, pingStatus: "timeout" } : s)),
      )
    }
  }

  const testAllPings = async () => {
    if (servers.length === 0 || isTestingPings) return

    setIsTestingPings(true)

    setServers((prevServers) =>
      prevServers.map((server) => ({
        ...server,
        ping: null,
        pingStatus: "testing" as const,
      })),
    )

    try {
      for (const server of servers) {
        try {
          const result = await testServerPing(server)

          setServers((prevServers) =>
            prevServers.map((s) => (s.id === server.id ? { ...s, ping: result.ping, pingStatus: result.status } : s)),
          )

          await new Promise((resolve) => setTimeout(resolve, 100))
        } catch (error) {
          console.error(`Error testing ping for ${server.id}:`, error)

          setServers((prevServers) =>
            prevServers.map((s) => (s.id === server.id ? { ...s, ping: null, pingStatus: "timeout" } : s)),
          )
        }
      }
    } catch (error) {
      console.error("Error in sequential ping testing:", error)
    } finally {
      setIsTestingPings(false)
    }
  }

  const canSelectServer = (server: Server) => {
    if (server.pingStatus === "failed" || server.pingStatus === "timeout") {
      return false
    }

    if (localConfig.type === "http" && !server.capabilities.http) {
      return false
    }
    if (localConfig.type === "tcp" && (!server.capabilities.tcp || !isAuthenticated)) {
      return false
    }

    return true
  }

  const getServerUnavailableReason = (server: Server) => {
    if (server.pingStatus === "failed" || server.pingStatus === "timeout") {
      return "Server unavailable"
    }
    if (localConfig.type === "tcp" && !server.capabilities.tcp) {
      return "TCP not supported"
    }
    if (localConfig.type === "tcp" && !isAuthenticated) {
      return "Sign in required for TCP"
    }
    if (localConfig.type === "http" && !server.capabilities.http) {
      return "HTTP not supported"
    }
    return null
  }

  const getCompatibleServers = () => {
    return servers.filter((server) => {
      if (localConfig.type === "http") return server.capabilities.http
      if (localConfig.type === "tcp") return server.capabilities.tcp && isAuthenticated
      return true
    })
  }

  const getPortRestrictionInfo = (server: Server) => {
    if (!server.portRestrictions) return "Ports: 1024+"

    const { allowedRanges } = server.portRestrictions

    if (allowedRanges && allowedRanges.length > 0) {
      const ranges = allowedRanges.map((r) => `${r.min}-${r.max}`).join(", ")
      return `Ports: ${ranges}`
    }

    return "Ports: 1024+"
  }

  const compatibleServers = getCompatibleServers()
  const hasTcpServers = servers.some((s) => s.capabilities.tcp)

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
      <h3 className="text-lg font-bold mb-6">Tunnel Configuration</h3>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium">Choose Your Server Location</h4>
          {servers.length > 0 && hasAutoTested && (
            <button
              onClick={testAllPings}
              disabled={isTestingPings}
              className="text-sm text-emerald-400 hover:text-emerald-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isTestingPings ? "animate-spin" : ""}
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
              {isTestingPings ? "Testing All..." : "Test All Pings"}
            </button>
          )}
        </div>

        {compatibleServers.length === 0 && servers.length > 0 && (
          <div className="bg-yellow-950 rounded-lg border border-yellow-800 p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-yellow-400"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" x2="12" y1="9" y2="13" />
                <line x1="12" x2="12.01" y1="17" y2="17" />
              </svg>
              <p className="text-yellow-400 font-medium">
                No servers support {localConfig.type.toUpperCase()} forwarding
                {!isAuthenticated && localConfig.type === "tcp" && " for guest users"}
              </p>
            </div>
            <p className="text-yellow-300 text-sm">
              {!isAuthenticated && localConfig.type === "tcp"
                ? "Please sign in to access TCP forwarding or switch to HTTP/HTTPS forwarding."
                : "Please switch to HTTP/HTTPS forwarding or wait for TCP-compatible servers to come online."}
            </p>
          </div>
        )}

        {isLoadingServers ? (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading available servers...</p>
          </div>
        ) : serverError ? (
          <div className="bg-red-950 rounded-lg border border-red-800 p-6 text-center">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-400 mx-auto"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" x2="9" y1="9" y2="15" />
                <line x1="9" x2="15" y1="9" y2="15" />
              </svg>
            </div>
            <p className="text-red-400 font-medium mb-2">Server Unavailable</p>
            <p className="text-red-300 text-sm">{serverError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        ) : servers.length === 0 ? (
          <div className="bg-yellow-950 rounded-lg border border-yellow-800 p-6 text-center">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-yellow-400 mx-auto"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" x2="12" y1="9" y2="13" />
                <line x1="12" x2="12.01" y1="17" y2="17" />
              </svg>
            </div>
            <p className="text-yellow-400 font-medium mb-2">No Servers Available</p>
            <p className="text-yellow-300 text-sm">All servers are currently offline for maintenance.</p>
          </div>
        ) : (
          <>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-3 mb-4">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: 100,
                  center: [0, 20],
                }}
                width={600}
                height={250}
                style={{
                  width: "100%",
                  height: "auto",
                }}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#374151"
                        stroke="#4b5563"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { outline: "none", fill: "#4b5563" },
                          pressed: { outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {servers.map((server) => (
                  <Marker
                    key={server.id}
                    coordinates={server.coordinates}
                    onClick={() => {
                      if (canSelectServer(server)) {
                        onServerSelect(server)
                      }
                    }}
                  >
                    <g>
                      {selectedServer?.id === server.id && (
                        <circle r="12" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.6">
                          <animate attributeName="r" values="6;15;6" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                        </circle>
                      )}
                      <circle r="6" fill={getMarkerColor(server)} stroke={getMarkerStroke(server)} strokeWidth="2" />
                      <text
                        textAnchor="middle"
                        y="-12"
                        style={{
                          fontFamily: "system-ui",
                          fontSize: "10px",
                          fontWeight: "bold",
                          fill: "white",
                          pointerEvents: "none",
                        }}
                      >
                        {server.location}
                      </text>
                    </g>
                  </Marker>
                ))}
              </ComposableMap>
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {servers.map((server) => {
                const canSelect = canSelectServer(server)
                const unavailableReason = getServerUnavailableReason(server)

                return (
                  <div
                    key={server.id}
                    onClick={() => {
                      if (canSelect) {
                        onServerSelect(server)
                      }
                    }}
                    className={`p-3 rounded-lg border transition-all duration-200 ${selectedServer?.id === server.id
                        ? "bg-emerald-950 border-emerald-500"
                        : !canSelect
                          ? "bg-red-950 border-red-800 cursor-not-allowed opacity-75"
                          : "bg-gray-800 border-gray-700 hover:border-gray-600 cursor-pointer"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-sm">{server.name}</h5>
                      <div
                        className={`w-2 h-2 rounded-full ${selectedServer?.id === server.id
                            ? "bg-emerald-400"
                            : !canSelect
                              ? "bg-red-400"
                              : server.pingStatus === "success" && server.ping !== null
                                ? server.ping < 100
                                  ? "bg-green-400"
                                  : server.ping < 300
                                    ? "bg-yellow-400"
                                    : server.ping < 500
                                      ? "bg-orange-400"
                                      : "bg-red-400"
                                : "bg-gray-600"
                          }`}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{server.location}</p>
                    <p className="text-xs font-mono text-gray-500 mb-2">{server.subdomain}</p>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-400">Supports:</span>
                      <div className="flex gap-1">
                        {server.capabilities.http && (
                          <span className="text-xs bg-blue-900 text-blue-300 px-1.5 py-0.5 rounded">HTTP</span>
                        )}
                        {server.capabilities.tcp && (
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded ${isAuthenticated ? "bg-purple-900 text-purple-300" : "bg-gray-700 text-gray-400"
                              }`}
                          >
                            TCP{!isAuthenticated && " 🔒"}
                          </span>
                        )}
                      </div>
                    </div>

                    {server.capabilities.tcp && isAuthenticated && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-300">{getPortRestrictionInfo(server)}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs">Ping:</span>
                      <div className="flex items-center gap-1">
                        {server.pingStatus === "testing" && (
                          <div className="animate-spin rounded-full h-3 w-3 border border-gray-400 border-t-transparent"></div>
                        )}
                        {hasAutoTested ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (server.pingStatus !== "testing") {
                                testPingForServer(server)
                              }
                            }}
                            disabled={server.pingStatus === "testing"}
                            className={`text-xs font-bold hover:underline disabled:no-underline disabled:cursor-not-allowed ${getPingColor(
                              server,
                            )}`}
                          >
                            {getPingDisplay(server)}
                          </button>
                        ) : (
                          <span className={`text-xs font-bold ${getPingColor(server)}`}>{getPingDisplay(server)}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{getPingStatus(server)}</p>
                    {unavailableReason && (
                      <p className="text-xs text-red-400 mt-1 font-medium">Cannot select - {unavailableReason}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {servers.length > 0 && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Forwarding Type</label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="forwardingType"
                  value="http"
                  checked={localConfig.type === "http"}
                  onChange={() => updateConfig({ type: "http", serverPort: 443 })}
                  className="sr-only"
                />
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${localConfig.type === "http"
                      ? "bg-emerald-950 border-emerald-500 text-emerald-400"
                      : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                    }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${localConfig.type === "http" ? "bg-emerald-400" : "bg-gray-500"}`}
                  />
                  <span className="font-medium">HTTP/HTTPS</span>
                </div>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="forwardingType"
                  value="tcp"
                  checked={localConfig.type === "tcp"}
                  onChange={handleTcpSelection}
                  disabled={!isAuthenticated && !hasTcpServers}
                  className="sr-only"
                />
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${localConfig.type === "tcp"
                      ? "bg-emerald-950 border-emerald-500 text-emerald-400"
                      : !isAuthenticated && hasTcpServers
                        ? "bg-gray-800 border-gray-700 text-gray-400 cursor-pointer hover:border-yellow-600"
                        : isAuthenticated && hasTcpServers
                          ? "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                          : "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-50"
                    }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${localConfig.type === "tcp" ? "bg-emerald-400" : "bg-gray-500"}`}
                  />
                  <span className="font-medium">TCP</span>
                  {!isAuthenticated && hasTcpServers && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-yellow-400"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  )}
                  {isAuthenticated && hasTcpServers && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-emerald-400"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                      <path d="m9 16 2 2 4-4" />
                    </svg>
                  )}
                </div>
              </label>
            </div>

            <p className="text-sm text-gray-400 mt-2">
              {localConfig.type === "http"
                ? "Best for web applications and APIs. Uses HTTPS (port 443) or HTTP (port 80)."
                : isAuthenticated
                  ? "For any TCP service like databases, game servers, or custom applications."
                  : "TCP forwarding requires authentication for security and abuse prevention."}
            </p>

            {showTcpLoginPrompt && !isAuthenticated && (
              <div className="mt-4 p-4 bg-blue-950 rounded-lg border border-blue-800">
                <div className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-400 mt-0.5 flex-shrink-0"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <div className="flex-1">
                    <h4 className="text-blue-400 font-medium mb-2">TCP Forwarding Requires Sign In</h4>
                    <p className="text-blue-300 text-sm mb-3">
                      To prevent abuse and ensure service quality, TCP forwarding requires user authentication. This
                      helps us maintain a reliable service for everyone.
                    </p>
                    <p className="text-blue-300 text-sm mb-4">
                      TCP forwarding allows you to tunnel any TCP-based service like databases, game servers, SSH, and
                      custom applications.
                    </p>
                    <div className="flex items-center gap-3">
                      <Link
                        href="/login"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
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
                        Sign In to Continue
                      </Link>
                      <button
                        onClick={() => {
                          setShowTcpLoginPrompt(false)
                          updateConfig({ type: "http", serverPort: 443 })
                        }}
                        className="text-blue-300 hover:text-blue-200 text-sm underline"
                      >
                        Use HTTP Instead
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!showTcpLoginPrompt && (
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Server Port (Internet Access)</label>
                {localConfig.type === "http" ? (
                  <select
                    value={localConfig.serverPort}
                    onChange={(e) => updateConfig({ serverPort: Number.parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  >
                    <option value={443}>443 (HTTPS)</option>
                    <option value={80}>80 (HTTP)</option>
                  </select>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={localConfig.serverPort === 0 ? "" : localConfig.serverPort}
                      onChange={(e) => updateConfig({ serverPort: Number.parseInt(e.target.value) || 0 })}
                      className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-white font-mono focus:outline-none ${portError ? "border-red-500 focus:border-red-400" : "border-gray-700 focus:border-emerald-500"
                        }`}
                      placeholder="0 for auto-assign"
                      min="0"
                      max="65535"
                    />
                    {portError && <p className="text-xs text-red-400">{portError}</p>}
                    {localConfig.serverPort === 0 && (
                      <p className="text-xs text-blue-400">Server will automatically assign an available port</p>
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {localConfig.type === "http"
                    ? "Standard web ports"
                    : localConfig.serverPort === 0
                      ? "Server will assign an available port automatically"
                      : "Port accessible from the internet (1024+)"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Local Port (Your Service)</label>
                <input
                  type="number"
                  value={localConfig.localPort}
                  onChange={(e) => updateConfig({ localPort: Number.parseInt(e.target.value) || 8000 })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  placeholder="8000"
                  min="1"
                  max="65535"
                />
                <p className="text-xs text-gray-400 mt-1">Port where your local service is running</p>
              </div>
            </div>
          )}

          {!showTcpLoginPrompt && selectedServer && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">SSH Command</label>
              <div className="relative">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 font-mono text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-all sm:break-normal">{generateCommand()}</pre>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="absolute right-3 top-3 h-8 w-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                  aria-label="Copy command"
                >
                  {copied ? (
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
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
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
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Run this command in your terminal to create the tunnel</p>
            </div>
          )}

          {!showTcpLoginPrompt && (
            <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-300">
                <span className="font-medium">Traffic Flow:</span> Internet →{" "}
                <span className="text-emerald-400 font-mono">
                  {selectedServer ? selectedServer.location : "Server"}:
                  {localConfig.serverPort === 0 ? "auto" : localConfig.serverPort}
                </span>{" "}
                → <span className="text-emerald-400 font-mono">localhost:{localConfig.localPort}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {localConfig.type === "http" ? (
                  <>
                    Your local service on port {localConfig.localPort} will be accessible via{" "}
                    {localConfig.serverPort === 443 ? "HTTPS" : "HTTP"}
                  </>
                ) : (
                  <>
                    TCP traffic to server port{" "}
                    {localConfig.serverPort === 0 ? "(auto-assigned)" : localConfig.serverPort} will be forwarded to
                    your localhost:
                    {localConfig.localPort}
                  </>
                )}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export type { Server }
