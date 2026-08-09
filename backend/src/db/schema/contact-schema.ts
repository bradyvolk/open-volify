import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { ContactRole } from "@shared/schemas/contact";

export const contact = pgTable("contact", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").unique(),
  phone: text("phone"),
  pronouns: text("pronouns"),
  role: text("role").notNull().$type<ContactRole>(),
  addressLine1: text("address_line1"),
  addressLine2: text("address_line2"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  country: text("country"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type Contact = typeof contact.$inferSelect;
export type NewContact = typeof contact.$inferInsert;
