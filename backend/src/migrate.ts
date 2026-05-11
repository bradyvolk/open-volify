import { config } from "dotenv";
import path from "path";
import { loadSecrets } from "./secrets";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

config({ path: path.join(process.cwd(), "backend", ".env") });
await loadSecrets();

const db = drizzle({ connection: process.env.DATABASE_URL! });
const migrationsFolder = path.join(import.meta.dir, "..", "drizzle");

console.log("Running migrations...");
await migrate(db, { migrationsFolder });
console.log("Migrations complete");
process.exit(0);
