const MISSING_JWT_SECRET_ERROR =
  "JWT_SECRET is not defined in environment variables.";

export const JWT_ISSUER = "portfolio-admin";

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error(MISSING_JWT_SECRET_ERROR);
  }
  return secret;
}
