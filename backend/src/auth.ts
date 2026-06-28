import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin as adminPlugin } from "better-auth/plugins"
import db from "./db/db"
import { user, account, session, verification } from "./db/schema/auth-schema"
import { Resend } from "resend"
import { ac, volunteer, staff, admin } from "./lib/permissions"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface SendVerificationEmailProps {
  user: { email: string }
  url: string
  token: string
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, account, session, verification },
  }),
  trustedOrigins: ["http://localhost:3001", "https://open-volify.org"],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async (
      { user, url, token }: SendVerificationEmailProps,
      request: any
    ) => {
      if (!resend) throw new Error("RESEND_API_KEY is not configured")
      await resend.emails.send({
        from: "noreply@open-volify.org",
        to: user.email as string,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      })
    },
  },
  plugins: [adminPlugin({ ac, roles: { volunteer, staff, admin } })],
})
