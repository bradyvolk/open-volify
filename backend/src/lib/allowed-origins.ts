const isProduction = process.env.NODE_ENV === "production";

/**
 * Extra origins supplied by self-hosters, e.g. when accessing the app via the
 * raw CloudFront default domain, a staging URL, or a second custom domain.
 *
 * Set ADDITIONAL_ALLOWED_ORIGINS to a comma-separated list of full origins,
 * e.g. ADDITIONAL_ALLOWED_ORIGINS="https://staging.example.org,https://admin.example.org"
 */
export function getAdditionalAllowedOrigins(): string[] {
  return (process.env.ADDITIONAL_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

/**
 * Exact origins allowed for CORS and trusted by Better Auth.
 *
 * Production is same-origin (frontend and API are served under one origin via
 * CloudFront), so this allowlist mainly exists to *deny* other origins. The
 * canonical public origin comes from APP_URL; localhost is only allowed in
 * development, where the frontend (:3001) calls the API (:3006) cross-origin.
 */
export function getAllowedOrigins(): string[] {
  const origins: string[] = [];
  if (!isProduction) origins.push("http://localhost:3001");
  if (process.env.APP_URL) origins.push(process.env.APP_URL);
  origins.push(...getAdditionalAllowedOrigins());
  return origins;
}
