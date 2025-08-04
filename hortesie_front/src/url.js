// Environment-specific URL configuration
// URLs are loaded from .env.dev or .env.prod files
export const API_URL = process.env.REACT_APP_API_URL || "http://hortesie.localhost/api";
export const DJANGO_URL = process.env.REACT_APP_DJANGO_URL || "http://hortesie.localhost/api";

// Additional environment-specific URLs
export const MAIN_DOMAIN = process.env.REACT_APP_MAIN_DOMAIN || "hortesie.localhost";
export const AUTH_DOMAIN = process.env.REACT_APP_AUTH_DOMAIN || "auth.hortesie.localhost";
export const CANONICAL_BASE = process.env.REACT_APP_CANONICAL_BASE || "https://hortesie.localhost";
export const AUTH_ISSUER = process.env.REACT_APP_AUTH_ISSUER || "http://auth.hortesie.localhost/realms/hortesie";