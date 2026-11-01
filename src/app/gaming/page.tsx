import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { connection } from 'next/server';
import { getActivitiesByType } from '@/lib/activities';
import { GamingMetadata } from '@/types/cms';

export const instant = false;

export const metadata: Metadata = {
  title: 'Gaming Activity — B Sunny',
  description: 'What I am playing and enjoying in my downtime.',
};

export default async function GamingPage() {
  await connection();
  const gamingItems = await getActivitiesByType('gaming');

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
          title="Gaming"
          label="DOWNTIME & PLAY"
          description="Games I am playing and titles I've enjoyed exploring."
        />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {gamingItems.map((item) => {
            const meta = (item.metadata || {}) as GamingMetadata;

            return (
              <div
                key={item._id?.toString() || item.title}
                className="p-6 rounded-2xl border border-border/80 bg-surface/50 flex flex-col sm:flex-row gap-5 items-start transition-all duration-200 hover:border-accent/50"
              >
                {item.coverImage && (
                  <div className="relative w-28 sm:w-32 aspect-[2/3] shrink-0 rounded-lg overflow-hidden border border-border/60 shadow-md">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      sizes="128px"
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
                      {item.isCurrent ? 'Currently Playing' : item.status}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-foreground tracking-tight leading-snug">
                    {item.title}
                  </h2>

                  {item.description && (
                    <p className="text-xs text-foreground-secondary font-mono">
                      {item.description}
                    </p>
                  )}

                  {meta.platform && (
                    <div className="flex items-center gap-1.5 text-xs font-mono text-foreground-muted pt-1">
                      <Gamepad2 className="w-3.5 h-3.5 text-accent" />
                      <span>{meta.platform}</span>
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
