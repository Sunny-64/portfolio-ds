import { portfolioData } from '@/data/portfolio';
import { BlogPost } from '@/types/portfolio';
import { getSiteUrl, absoluteUrl } from '@/lib/site';

/**
 * Generates Schema.org Person structured data using verified portfolio details.
 */
export function getPersonSchema() {
  const siteUrl = getSiteUrl();
  const publicProfiles = portfolioData.contact.socials
    .filter((s) => ['linkedin', 'github', 'x'].includes(s.platform))
    .map((s) => s.url);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'B Sunny',
    jobTitle: portfolioData.role,
    description: portfolioData.heroDescription,
    url: siteUrl,
    image: absoluteUrl('/images/profile/sunny.png'),
    email: 'sunny6464n@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jalandhar',
      addressCountry: 'India',
    },
    sameAs: publicProfiles,
  };
}

/**
 * Generates Schema.org WebSite structured data for the portfolio root.
 */
export function getWebSiteSchema() {
  const siteUrl = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'B Sunny Portfolio',
    url: siteUrl,
    description: portfolioData.heroDescription,
    author: {
      '@type': 'Person',
      name: 'B Sunny',
    },
  };
}

/**
 * Generates Schema.org BlogPosting structured data for published blog posts.
 */
export function getBlogPostingSchema(post: BlogPost) {
  const siteUrl = getSiteUrl();
  const imageUrl = post.thumbnailUrl
    ? post.thumbnailUrl.startsWith('http')
      ? post.thumbnailUrl
      : absoluteUrl(post.thumbnailUrl)
    : absoluteUrl('/images/profile/sunny.png');

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: 'B Sunny',
      url: siteUrl,
    },
    image: imageUrl,
    url: absoluteUrl(`/blog/${post.slug}`),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(`/blog/${post.slug}`),
    },
  };
}
