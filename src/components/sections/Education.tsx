'use client';

import React from 'react';
import Image from 'next/image';
import { GraduationCap } from 'lucide-react';
import { educationData } from '@/data/education';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Education() {
  return (
    <section id="education" className="relative pt-16 sm:pt-20 pb-16 sm:pb-24 border-t border-border overflow-hidden">
      {/* Botanical illustration decoration on the right */}
      {/* <div
        className="pointer-events-none absolute right-0 bottom-0 w-32 sm:w-44 md:w-56 h-auto opacity-20 dark:opacity-15 select-none z-0"
        aria-hidden="true"
      >
        <Image
          src="/images/botanical.png"
          alt=""
          width={220}
          height={400}
          className="object-contain ml-auto"
        />
      </div> */}

      <Reveal className="relative z-10">
        <div className="mb-10">
          <SectionHeading
            number="06"
            label="EDUCATION"
            title="Academic Background."
          />
        </div>

        <div className="max-w-3xl space-y-8">
          {educationData.map((item) => (
            <div key={item.id} className="flex items-start gap-4 sm:gap-5 group">
              <div className="p-2 sm:p-2.5 rounded-lg border border-border bg-surface text-foreground shrink-0 mt-0.5 group-hover:border-accent transition-colors">
                <GraduationCap className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h3 className="font-semibold text-foreground text-base sm:text-lg">
                    {item.degree}
                  </h3>
                  <span className="font-mono text-xs text-foreground-muted">
                    {item.period}
                  </span>
                </div>
                <div className="font-mono text-xs text-foreground-secondary">
                  {item.institution}
                  {item.location && ` · ${item.location}`}
                </div>
                {item.description && (
                  <p className="text-sm text-foreground-secondary font-light pt-1">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
