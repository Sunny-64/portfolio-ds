import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

/**
 * Generates the robots.txt file for search engine crawlers.
 * Allows public routes, explicitly disallows private/internal paths, and links to sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api', '/api/*'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
