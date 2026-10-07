'use client';

import React from 'react';
import { Award, BookOpen } from 'lucide-react';
import { CERTIFICATIONS } from '@/data/certifications';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Certifications() {
  return (
    <section id="certifications" className="pt-14 sm:pt-16 pb-14 sm:pb-20 border-t border-border">
      <Reveal>
        <div className="mb-8">
          <SectionHeading title="Certifications & Training." />
        </div>

        {/* Compact editorial list */}
        <div className="max-w-3xl divide-y divide-border/60">
          {CERTIFICATIONS.map((item) => (
            <div
              key={item.id}
              className="py-5 first:pt-0 last:pb-0 flex items-start gap-4 sm:gap-5 group"
            >
              <div className="p-2 rounded border border-border bg-surface text-foreground shrink-0 mt-0.5 group-hover:border-accent transition-colors">
                {item.status ? (
                  <BookOpen className="w-4 h-4 text-accent" />
                ) : (
                  <Award className="w-4 h-4 text-accent" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-medium text-foreground text-sm sm:text-base">
                      {item.title}
                    </h3>
                    <span className="text-foreground-muted text-xs" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-foreground-secondary text-xs sm:text-sm font-normal">
                      {item.organization}
                    </span>
                  </div>

                  {item.status ? (
                    <span className="font-mono text-[11px] tracking-wider font-semibold text-accent uppercase shrink-0">
                      {item.status}
                    </span>
                  ) : item.period ? (
                    <span className="font-mono text-xs text-foreground-muted shrink-0">
                      {item.period}
                    </span>
                  ) : null}
                </div>

                <p className="text-foreground-secondary text-xs sm:text-sm leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
