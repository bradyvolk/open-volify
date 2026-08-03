import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, volunteer, staff, admin } from "@shared/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NODE_ENV === "production" ? window.location.origin : "http://localhost:3006",
  plugins: [adminClient({ ac, roles: { volunteer, staff, admin } })],
});
