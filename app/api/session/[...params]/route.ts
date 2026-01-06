import { auth } from "@/lib/auth";
import { headers } from "next/headers"
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest, context: { params: Promise<{ params: string[] }> }) {
  const { params } = await context.params;
  const requestHeaders = await headers();
  const result = await auth.api.getToken({ headers: requestHeaders }).catch(() => null);
  if (!result || typeof result !== "object" || !("token" in result)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { token } = result as { token: string };
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const data = await fetch(`${process.env.API_URL}/api/session/${params.join("/")}`, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    body: await req.text(),
  })

  return data;
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ params: string[] }> }) {
  const { params } = await context.params;
  if (!params || params.length < 3) {
    return new Response("Bad Request", { status: 400 });
  }
  const node = params[0]
  const tunnelType = params[1]
  const slug = params[2]

  const requestHeaders = await headers();
  const result = await auth.api.getToken({ headers: requestHeaders }).catch(() => null);
  if (!result || typeof result !== "object" || !("token" in result)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { token } = result as { token: string };
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const data = await fetch(`${process.env.API_URL}/api/session/${node}/${tunnelType}/${slug}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    body: await req.text(),
  })

  return data;
}