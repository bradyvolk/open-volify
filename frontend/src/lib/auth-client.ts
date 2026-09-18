import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, volunteer, staff, admin } from "@shared/permissions";

export const authClient = createAuthClient({
  baseURL: window.location.origin,
  plugins: [adminClient({ ac, roles: { volunteer, staff, admin } })],
});
