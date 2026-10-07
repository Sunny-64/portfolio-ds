'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getPublishedPosts } from '@/data/blog';

export default function BlogArchivePage() {
  const posts = getPublishedPosts();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-20 sm:pb-28">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-mono text-xs text-foreground-secondary hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-3 pb-8 sm:pb-12 border-b border-border">
          <div className="font-mono text-xs tracking-wider uppercase text-foreground-muted">
            THOUGHTS &amp; WRITING
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-foreground font-normal tracking-tight">
            Latest from the Blog.
          </h1>
          <p className="text-foreground-secondary text-sm sm:text-base font-light max-w-2xl leading-relaxed">
            Ideas, technical deep dives, and lessons learned from working with data and software.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <p className="font-mono text-sm text-foreground-muted">
              Articles and case studies coming soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-10">
            {posts.map((post) => (
              <div key={post.slug} className="p-4 border rounded-lg">
                {post.title}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
