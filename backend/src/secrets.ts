import { resolve } from "path";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

// ---------------------------------------------------------------------------
// Handlers
// Each handler receives the raw secret string and writes the resolved value
// into process.env so the rest of the app uses standard env var access
// regardless of where the value came from (Secrets Manager or .env).
// ---------------------------------------------------------------------------

const certPath = resolve(import.meta.dir, "../certs/global-bundle.pem");

function applyDatabaseSecret(raw: string): void {
  const { host, port, username, password, dbname } = JSON.parse(raw);
  process.env.DATABASE_URL = `postgresql://${encodeURIComponent(username)}:${encodeURIComponent(
    password,
  )}@${host}:${port}/${dbname}?sslmode=verify-full&sslrootcert=${certPath}`;
}

function applyBetterAuthSecret(val: string): void {
  process.env.BETTER_AUTH_SECRET = val;
}

function applyResendApiKey(val: string): void {
  process.env.RESEND_API_KEY = val;
}

// ---------------------------------------------------------------------------
// Loader
// ---------------------------------------------------------------------------

interface SecretSpec {
  arn: string | undefined;
  apply: (val: string) => void;
}

function hasArn(spec: SecretSpec): spec is { arn: string; apply: (val: string) => void } {
  return spec.arn != null;
}

async function fetchSecret(client: SecretsManagerClient, arn: string): Promise<string> {
  const { SecretString } = await client.send(new GetSecretValueCommand({ SecretId: arn }));
  if (!SecretString) throw new Error(`No value for secret: ${arn}`);
  return SecretString;
}

// Add new secrets here — one entry per Secrets Manager ARN env var.
const SECRET_SPECS: SecretSpec[] = [
  { arn: process.env.DATABASE_SECRET_ARN, apply: applyDatabaseSecret },
  { arn: process.env.BETTER_AUTH_SECRET_ARN, apply: applyBetterAuthSecret },
  { arn: process.env.RESEND_API_KEY_ARN, apply: applyResendApiKey },
];

/**
 * Fetches secrets from AWS Secrets Manager and populates process.env.
 * No-op when no ARN env vars are set (local dev — values come from .env instead).
 */
export async function loadSecrets(): Promise<void> {
  const pending = SECRET_SPECS.filter(hasArn);
  if (!pending.length) return;

  const client = new SecretsManagerClient({
    region: process.env.AWS_REGION ?? "us-east-1",
  });

  await Promise.all(pending.map(({ arn, apply }) => fetchSecret(client, arn).then(apply)));
}
