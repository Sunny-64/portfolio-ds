import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { connection } from 'next/server';
import { getActivitiesByType } from '@/lib/activities';
import { ReadingMetadata } from '@/types/cms';

export const instant = false;

export const metadata: Metadata = {
  title: 'Reading Shelf — B Sunny',
  description: 'Books, literature, and articles I am reading and have enjoyed.',
};

export default async function ReadingPage() {
  await connection();
  const readingItems = await getActivitiesByType('reading');

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground-secondary hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
          </Link>
        </div>

        <SectionHeading
          title="Reading Shelf"
          label="BOOKS & LITERATURE"
          description="A collection of books, short stories, and technical readings I have explored or am currently reading."
        />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {readingItems.map((item) => {
            const meta = (item.metadata || {}) as ReadingMetadata;

            return (
              <div
                key={item._id?.toString() || item.title}
                className="p-6 rounded-2xl border border-border/80 bg-surface/50 flex flex-col sm:flex-row gap-5 items-start transition-all duration-200 hover:border-accent/50"
              >
                {item.coverImage && (
                  <div className="relative w-24 sm:w-28 aspect-[2/3] shrink-0 rounded-lg overflow-hidden border border-border/60 shadow-md">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                        item.isCurrent
                          ? 'bg-accent/15 text-accent font-medium'
                          : 'bg-surface-elevated text-foreground-muted'
                      }`}
                    >
                      {item.isCurrent ? 'Currently Reading' : item.status}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-foreground tracking-tight leading-snug">
                    {item.title}
                  </h2>

                  {(meta.author || item.description) && (
                    <p className="text-xs text-foreground-secondary font-mono">
                      {meta.author ? `by ${meta.author}` : item.description}
                    </p>
                  )}

                  {meta.rating && (
                    <div className="flex items-center gap-1 text-accent pt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < meta.rating! ? 'fill-accent text-accent' : 'text-border'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {meta.notes && (
                    <p className="text-xs text-foreground-muted/90 font-light pt-1 leading-relaxed">
                      {meta.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
