import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getPostBySlug, getPublishedPosts } from '@/data/blog';
import { getBlogPostingSchema } from '@/lib/schema';
import { absoluteUrl } from '@/lib/site';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getPublishedPosts();
  if (posts.length === 0) {
    return [{ slug: '__placeholder__' }];
  }
  return posts.map((post) => ({
    slug: post.slug,
  }));
}


export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  // If the post does not exist or is an unpublished draft, prevent indexing
  if (!post || !post.published) {
    return {
      title: 'Post Not Found',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const ogImage = post.thumbnailUrl
    ? post.thumbnailUrl.startsWith('http')
      ? post.thumbnailUrl
      : absoluteUrl(post.thumbnailUrl)
    : absoluteUrl('/images/profile/sunny.png');

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} — B Sunny`,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      url: `/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} — B Sunny`,
      description: post.description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  // Draft or missing posts must not be exposed on public routes
  if (!post || !post.published) {
    notFound();
  }

  const schema = getBlogPostingSchema(post);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-20 sm:pb-28">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 font-mono text-xs text-foreground-secondary hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Blog</span>
        </Link>

        <article className="space-y-8">
          <header className="space-y-4 pb-8 border-b border-border">
            <div className="font-mono text-xs tracking-wider uppercase text-accent font-semibold">
              {post.category}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground font-normal tracking-tight leading-tight">
              {post.title}
            </h1>
            <p className="text-foreground-secondary text-base sm:text-lg leading-relaxed font-light">
              {post.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-foreground-muted pt-2">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {post.publishedAt}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime}
              </span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-foreground-secondary"
                  >
                    <Tag className="w-3 h-3 text-accent" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none pt-4 text-foreground-secondary font-light leading-relaxed">
            <p>Content for this article is being formatted.</p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
