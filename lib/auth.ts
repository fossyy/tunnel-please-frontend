import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema/auth"
import { jwt } from "better-auth/plugins";

export const auth = betterAuth({
    plugins: [jwt()],
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
    user: {
        additionalFields: {
            sshIdentifier: {
                type: "string",
                nullable: false,
                input: false,
            }
        },
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema
    })
});