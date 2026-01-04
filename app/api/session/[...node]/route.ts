import { auth } from "@/lib/auth";
import { headers } from "next/headers"
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest, context: { params: Promise<{ node: string[] }> }) {
  const { node } = await context.params;
  const requestHeaders = await headers();
  const result = await auth.api.getToken({ headers: requestHeaders }).catch(() => null);
  if (!result || typeof result !== "object" || !("token" in result)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { token } = result as { token: string };
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const data = await fetch(`${process.env.API_URL}/api/session/${node.join("/")}`, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    body: await req.text(),
  })

  return data;
}