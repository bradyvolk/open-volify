import { config } from "dotenv";
import path from "path";

// Load backend/.env for local test runs. When the file is absent (e.g. CI),
// this is a no-op and DATABASE_URL is expected to be set in the environment.
// dotenv does not override variables already present in process.env, so CI's
// exported values always take precedence.
config({ path: path.join(process.cwd(), "backend", ".env") });
