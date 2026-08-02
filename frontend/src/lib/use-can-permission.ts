import { authClient } from "./auth-client"
import type { AppRole } from "./permissions"

type PermissionCheck = NonNullable<
  Parameters<typeof authClient.admin.checkRolePermission>[0]["permissions"]
>

/**
 * Client-side permission check for the current session's role, built on better-auth's
 * `checkRolePermission` (no network call — it re-derives from the same access-control
 * definitions the backend uses). Returns `false` while the session is loading or signed out.
 */
export function useCanPermission(permissions: PermissionCheck): boolean {
  const { data: session } = authClient.useSession()
  const role = session?.user.role as AppRole | undefined
  if (!role) return false

  return authClient.admin.checkRolePermission({ role, permissions })
}
