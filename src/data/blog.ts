import { BlogPost } from '@/types/portfolio';

/**
 * Real published blog posts data.
 * Currently empty since no posts are published yet.
 * When real articles are added, set published: true to expose the section on the homepage and enable the /blog page.
 */
export const BLOG_POSTS: BlogPost[] = [];

/**
 * Returns all published blog posts.
 */
export function getPublishedPosts(): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.published);
}

/**
 * Returns featured published posts for the homepage.
 */
export function getFeaturedBlogPosts(limit = 3): BlogPost[] {
  return getPublishedPosts()
    .filter((post) => post.featured ?? true)
    .slice(0, limit);
}
