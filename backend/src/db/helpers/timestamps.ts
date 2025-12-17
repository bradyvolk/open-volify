import { timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp({ withTimezone: true }),
};
