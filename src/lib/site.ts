/**
 * Centralized site configuration for SEO, metadata, canonical URLs, and sitemaps.
 *
 * Configured via NEXT_PUBLIC_SITE_URL or SITE_URL environment variables.
 * Falls back to localhost in local development if not configured.
 */
export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return 'http://localhost:3000';
}

/**
 * Returns an absolute URL for a given relative path using the centralized site base URL.
 */
export function absoluteUrl(path = ''): string {
  const base = getSiteUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export const siteConfig = {
  name: 'B Sunny',
  title: 'B Sunny — Data Analyst × Software Developer',
  description:
    "I'm B Sunny, a developer transitioning into data analytics, combining problem solving with data to build useful products and insights.",
  get url() {
    return getSiteUrl();
  },
  ogImage: '/images/profile/sunny.png',
  googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION,
};
