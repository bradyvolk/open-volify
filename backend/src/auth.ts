import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "./db/db";
import { user, account, session, verification } from "./db/schema/auth-schema";
import { Resend } from "resend";
import { config } from "dotenv";
import path from "path";

config({ path: path.join(process.cwd(), "backend", ".env") });

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendVerificationEmailProps {
  user: { email: string };
  url: string;
  token: string;
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      account,
      session,
      verification,
    },
  }),
  trustedOrigins: ["http://localhost:3001"],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async (
      { user, url, token }: SendVerificationEmailProps,
      request: any
    ) => {
      if (!resend) {
        throw new Error("RESEND_API_KEY is not configured");
      }
      await resend.emails.send({
        from: "noreply@open-volify.org",
        to: user.email as string,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
});
