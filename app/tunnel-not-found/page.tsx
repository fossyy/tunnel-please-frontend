"use client"

import Image from "next/image"
import Link from "next/link"

export default function TunnelNotFound() {
  const exampleUrl = "example.com"

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <Image
              src="/mascot-confused.png"
              alt="Confused tunnel mascot"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>

          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-6">Tunnel Not Found</h1>
            <p className="text-gray-400 mb-6 text-lg">We couldn't find an active tunnel for:</p>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 font-mono text-emerald-400 text-xl max-w-md mx-auto mb-8">
              {exampleUrl}
            </div>
            <p className="text-gray-300 text-lg">This means no SSH tunnel is currently running for this domain.</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 mb-8 text-left">
            <h2 className="text-xl font-bold mb-6 text-center">To create a tunnel:</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  1
                </span>
                <div>
                  <p className="text-gray-300 font-medium">Go to the main page</p>
                  <p className="text-gray-400 text-sm">Configure your tunnel settings and choose a server</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  2
                </span>
                <div>
                  <p className="text-gray-300 font-medium">Make sure your local service is running</p>
                  <p className="text-gray-400 text-sm">Your application should be accessible on localhost</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  3
                </span>
                <div>
                  <p className="text-gray-300 font-medium">Run the SSH command</p>
                  <p className="text-gray-400 text-sm">Copy and paste the generated command into your terminal</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  4
                </span>
                <div>
                  <p className="text-gray-300 font-medium">Access your tunnel</p>
                  <p className="text-gray-400 text-sm">Your service will be available through the tunnel URL</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
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
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
              Create Your Tunnel
            </Link>

            <p className="text-gray-400 text-sm">Need help? Check our documentation or contact support.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
