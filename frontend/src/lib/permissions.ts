import { createAccessControl } from "better-auth/plugins/access"
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access"

const statement = {
  ...defaultStatements,
  contact: ["create", "read", "update", "delete"],
} as const

export const ac = createAccessControl(statement)

export type AppRole = "volunteer" | "staff" | "admin"

export const volunteer = ac.newRole({
  contact: ["read"],
})

export const staff = ac.newRole({
  contact: ["create", "read", "update"],
  ...adminAc.statements,
})

export const admin = ac.newRole({
  contact: ["create", "read", "update", "delete"],
  ...adminAc.statements,
})
