import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "@/lib/auth"

export const authClient = createAuthClient({
    plugins: [jwtClient(), inferAdditionalFields<typeof auth>()],
})