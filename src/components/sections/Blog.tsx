'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getFeaturedBlogPosts } from '@/data/blog';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Blog() {
  const posts = getFeaturedBlogPosts(3);

  // Strictly hide the entire section if no published posts exist
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="pt-16 sm:pt-20 pb-16 sm:pb-24 border-t border-border">
      <Reveal>
        <div className="mb-10 sm:mb-12">
          <SectionHeading
            title="Latest from the Blog."
            label="THOUGHTS, NOTES AND THINGS I'VE LEARNED"
            description="Ideas and lessons from data, software, technology and the things I'm exploring."
          />
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col justify-between space-y-3 p-4 rounded-xl border border-border bg-surface/40 hover:bg-surface hover:border-accent/40 transition-all duration-200"
            >
              <div className="space-y-3">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-border bg-surface">
                  <Image
                    src={post.thumbnailUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-103"
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-foreground-muted pt-1">
                  <span className="text-accent uppercase">{post.category}</span>
                  <span>{post.readingTime}</span>
                </div>

                <h3 className="font-semibold text-foreground text-base group-hover:text-accent transition-colors duration-200">
                  {post.title}
                </h3>

                <p className="text-foreground-secondary text-xs sm:text-sm font-light leading-relaxed line-clamp-2">
                  {post.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border/50 text-[11px] font-mono text-foreground-muted">
                {post.publishedAt}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 sm:mt-10 flex justify-end">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-foreground-secondary hover:text-accent transition-colors py-1.5"
          >
            <span>View all posts</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1 text-accent">
              →
            </span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
