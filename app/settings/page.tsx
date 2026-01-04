"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export default function SettingsPage() {
  const [requireAuth, setRequireAuth] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return <div>Loading...</div>;
  }
  
  const handleToggle = (value: boolean) => {
    setRequireAuth(value)
    setMessage(value ? "Authentication required for tunnel requests" : "Authentication not required for tunnel requests")
    setTimeout(() => setMessage(null), 2500)
  }

  return session ? (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white">
      <SiteHeader session={session} />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-sm text-gray-400">Control how tunnels can be requested.</p>
          </div>

          {message && (
            <div className="rounded-lg border border-emerald-700 bg-emerald-900/40 px-4 py-3 text-sm text-emerald-200">
              {message}
            </div>
          )}

          <div className="rounded-lg border border-gray-800 bg-gray-900 p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Tunnel Request Authentication</h2>
                <p className="text-sm text-gray-400">Require users to be authenticated before they can request a tunnel.</p>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <span className="text-sm text-gray-300">{requireAuth ? "Required" : "Not required"}</span>
                <input
                  type="checkbox"
                  checked={requireAuth}
                  onChange={(e) => handleToggle(e.target.checked)}
                  className="sr-only"
                />
                <span
                  className={`relative inline-flex h-6 w-11 items-center rounded-full border ${requireAuth ? "bg-emerald-600 border-emerald-500" : "bg-gray-700 border-gray-600"}`}
                >
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${requireAuth ? "translate-x-5" : "translate-x-1"}`}
                  />
                </span>
              </label>
            </div>
            <p className="text-xs text-gray-500">
              This toggle is local-only for now. Wire it to your backend when ready to enforce tunnel request policies.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  ) : null;
}
