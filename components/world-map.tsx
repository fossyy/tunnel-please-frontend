"use client"

import { useState, useEffect } from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

interface Server {
  id: string
  name: string
  location: string
  subdomain: string
  coordinates: [number, number] // [longitude, latitude]
  ping: number | null
}

const servers: Server[] = [
  {
    id: "us",
    name: "United States",
    location: "Chicago",
    subdomain: "us.tunnl.live",
    coordinates: [-87.6298, 41.8781],
    ping: null,
  },
  {
    id: "eu",
    name: "Europe",
    location: "Frankfurt",
    subdomain: "eu.tunnl.live",
    coordinates: [8.6821, 50.1109],
    ping: null,
  },
  {
    id: "sgp",
    name: "Singapore",
    location: "Singapore",
    subdomain: "sgp.tunnl.live",
    coordinates: [103.8198, 1.3521],
    ping: null,
  },
  {
    id: "id",
    name: "Indonesia",
    location: "Bogor",
    subdomain: "id.tunnl.live",
    coordinates: [106.8456, -6.5950],
    ping: null,
  },
]

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

interface WorldMapProps {
  onServerSelect: (server: Server) => void
  selectedServer: Server
}

export default function WorldMap({ onServerSelect, selectedServer }: WorldMapProps) {
  const [serverPings, setServerPings] = useState<Server[]>(servers)
  const [isLoading, setIsLoading] = useState(true)

  const getPingColor = (ping: number | null) => {
    if (!ping) return "text-gray-400"
    if (ping < 50) return "text-green-400"
    if (ping < 100) return "text-yellow-400"
    if (ping < 150) return "text-orange-400"
    return "text-red-400"
  }

  const getPingStatus = (ping: number | null) => {
    if (!ping) return "Testing..."
    if (ping < 50) return "Excellent"
    if (ping < 100) return "Good"
    if (ping < 150) return "Fair"
    return "Poor"
  }

  const getMarkerColor = (server: Server) => {
    if (selectedServer.id === server.id) return "#10b981"
    return "#6b7280"
  }

  const getMarkerStroke = (server: Server) => {
    if (selectedServer.id === server.id) return "#34d399"
    return "#9ca3af"
  }

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-center mb-6">Choose Your Server Location</h3>

      <div className="relative bg-gray-900 rounded-lg border border-gray-800 p-4 mb-6 overflow-hidden">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [0, 20],
          }}
          width={800}
          height={400}
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

          {serverPings.map((server) => (
            <Marker
              key={server.id}
              coordinates={server.coordinates}
              onClick={() => onServerSelect(server)}
            >
              <g>
                {selectedServer.id === server.id && (
                  <circle r="15" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.6">
                    <animate attributeName="r" values="8;20;8" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}

                <circle
                  r="8"
                  fill={getMarkerColor(server)}
                  stroke={getMarkerStroke(server)}
                  strokeWidth="2"
                  className="transition-all duration-200 hover:r-10"
                />

                <text
                  textAnchor="middle"
                  y="-15"
                  style={{
                    fontFamily: "system-ui",
                    fontSize: "12px",
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

      <div className="grid gap-4 md:grid-cols-3">
        {serverPings.map((server) => (
          <div
            key={server.id}
            onClick={() => onServerSelect(server)}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${selectedServer.id === server.id
                ? "bg-emerald-950 border-emerald-500"
                : "bg-gray-900 border-gray-800 hover:border-gray-700"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold">{server.name}</h4>
              <div
                className={`w-3 h-3 rounded-full ${selectedServer.id === server.id ? "bg-emerald-400" : "bg-gray-600"}`}
              />
            </div>
            <p className="text-sm text-gray-400 mb-2">{server.location}</p>
            <p className="text-xs font-mono text-gray-500 mb-2">{server.subdomain}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm">Ping:</span>
              {isLoading ? (
                <span className="text-sm text-gray-400">Testing...</span>
              ) : (
                <span className={`text-sm font-bold ${getPingColor(server.ping)}`}>
                  {server.ping}ms ({getPingStatus(server.ping)})
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
