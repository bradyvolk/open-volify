#!/usr/bin/env bun
// Preflight check for `bun run dev`. Fails fast with a clear message instead
// of a cryptic EADDRINUSE — the common cause is a second checkout (e.g. a
// git worktree) already running the dev servers on the default ports.
import { config } from "dotenv";
import path from "path";

config({ path: path.join(process.cwd(), "backend", ".env") });

const ports: Array<{ name: string; envVar: string; value: number }> = [
  { name: "backend", envVar: "PORT", value: Number(process.env.PORT) || 3006 },
  { name: "frontend", envVar: "FRONTEND_PORT", value: Number(process.env.FRONTEND_PORT) || 3001 },
];

async function isPortFree(port: number): Promise<boolean> {
  try {
    const server = Bun.listen({
      hostname: "0.0.0.0",
      port,
      socket: { open() {}, data() {}, close() {}, error() {} },
    });
    server.stop(true);
    return true;
  } catch {
    return false;
  }
}

const busy = [];
for (const port of ports) {
  if (!(await isPortFree(port.value))) busy.push(port);
}

if (busy.length > 0) {
  console.error("\n✗ Port(s) already in use — is another instance already running?\n");
  for (const port of busy) {
    console.error(`  ${port.name} port ${port.value} (${port.envVar})`);
  }
  console.error(
    "\nIf that's a second worktree/checkout you're running intentionally, set a\n" +
      "different PORT/FRONTEND_PORT (and matching BETTER_AUTH_URL) in this\n" +
      "checkout's backend/.env — see 'Running multiple instances' in the README.\n",
  );
  process.exit(1);
}
