"use client"

import { useState } from "react"
import TunnelConfig, { type TunnelConfig as TunnelConfigType, type Server } from "@/components/tunnel-config"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { authClient } from "@/lib/auth-client"

const defaultConfig: TunnelConfigType = {
  type: "http",
  serverPort: 443,
  localPort: 8000,
}

export default function Home() {
  const [selectedServer, setSelectedServer] = useState<Server | null>(null)
  const [tunnelConfig, setTunnelConfig] = useState<TunnelConfigType>(defaultConfig)
  const { data: session } = authClient.useSession()
  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white">
      <SiteHeader session={session}/>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              <span className="text-emerald-400">tunel</span>.live
            </h1>
            <p className="text-lg text-gray-400 md:text-xl max-w-2xl mx-auto">
              Expose your local services to the internet securely with our fast and reliable SSH tunneling service.
            </p>
          </div>

          <TunnelConfig
            config={tunnelConfig}
            onConfigChange={setTunnelConfig}
            selectedServer={selectedServer}
            onServerSelect={setSelectedServer}
            isAuthenticated={Boolean(session)}
            userId={session?.user?.sshIdentifier}
          />

          <div className="max-w-3xl mx-auto">
            <div className="grid gap-8 md:grid-cols-3 mb-16">
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <div className="mb-4 inline-block rounded-full bg-emerald-950 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-emerald-400"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Global Network</h3>
                <p className="text-gray-400">
                  Choose from servers in US, Singapore, and Indonesia for optimal performance.
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <div className="mb-4 inline-block rounded-full bg-emerald-950 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-emerald-400"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Secure by Default</h3>
                <p className="text-gray-400">
                  End-to-end encryption with SSH ensures your data remains private and secure.
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <div className="mb-4 inline-block rounded-full bg-emerald-950 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-emerald-400"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1-2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" x2="21" y1="14" y2="3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Flexible Configuration</h3>
                <p className="text-gray-400">
                  Support for both HTTP/HTTPS and TCP tunneling with custom port configuration.
                </p>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">100% Free Service</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                No registration required. Just run the command and start using the tunnel immediately.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
