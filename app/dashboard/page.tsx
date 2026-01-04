import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import DashboardClient from "./dashboard-client"

export default async function DashboardPage() {
  const { token } = await auth.api.getToken({
      headers: await headers(),
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
      <SiteHeader />
      <DashboardClient initialActiveConnections={initialActiveConnections} />
      <SiteFooter />
    </div>
  )
}
