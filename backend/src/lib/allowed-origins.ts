/**
 * Origins that are always trusted, covering local development and the hosted
 * open-volify.org deployment (CloudFront / API Gateway).
 */
const DEFAULT_TRUSTED_ORIGINS = [
  "http://localhost:3001",
  "https://open-volify.org",
]

/**
 * Extra origins supplied by self-hosters running on a custom domain.
 *
 * Set ADDITIONAL_ALLOWED_ORIGINS to a comma-separated list of full origins,
 * e.g. ADDITIONAL_ALLOWED_ORIGINS="https://volunteers.example.org,https://admin.example.org"
 */
export function getAdditionalAllowedOrigins(): string[] {
  return (process.env.ADDITIONAL_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
}

/** Full origins trusted by Better Auth (defaults + self-hosted custom domains). */
export function getTrustedOrigins(): string[] {
  return [...DEFAULT_TRUSTED_ORIGINS, ...getAdditionalAllowedOrigins()]
}

/** Hostnames of the additional origins, for hostname-based CORS matching. */
export function getAdditionalAllowedHostnames(): string[] {
  return getAdditionalAllowedOrigins().map((origin) => new URL(origin).hostname)
}
