import { config } from "dotenv";
import path from "path";
import { loadSecrets } from "./secrets";

// Load .env for local dev — no-op in Lambda where the file doesn't exist
config({ path: path.join(process.cwd(), "backend", ".env") });

await loadSecrets();

// Dynamic import ensures server.ts (and its transitive imports like db.ts and
// auth.ts) only initialize after process.env is fully populated.
await import("./server");
