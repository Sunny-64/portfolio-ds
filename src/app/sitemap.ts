import type { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/data/blog';
import { absoluteUrl } from '@/lib/site';

/**
 * Generates the dynamic sitemap for Google Search Console and web crawlers.
 * Includes only indexable, public routes and published articles.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const publishedPosts = getPublishedPosts();
  const lastModified = new Date();

  const routes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: absoluteUrl('/projects'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/blog'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Dynamically include only published blog posts (status = published)
  for (const post of publishedPosts) {
    routes.push({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.publishedAt ? new Date(post.publishedAt) : lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  return routes;
}
