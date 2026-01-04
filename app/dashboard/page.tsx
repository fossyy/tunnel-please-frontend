import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import DashboardClient from "./dashboard-client"
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({
    headers: requestHeaders,
  }).catch(() => {
    redirect('/')
  })

  const { token } = await auth.api.getToken({
    headers: requestHeaders,
  }).catch(() => {
    redirect('/')
  })

  const data = await fetch(`${process.env.API_URL}/api/sessions`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    cache: "no-store",
  })
  const initialActiveConnections = await data.json()

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white">
      <SiteHeader session={session} />
      <DashboardClient
        initialActiveConnections={initialActiveConnections}
      />
      <SiteFooter />
    </div>
  )
}
