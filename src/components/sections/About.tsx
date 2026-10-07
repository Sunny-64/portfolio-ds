'use client';

import React from 'react';
import { portfolioData } from '@/data/portfolio';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function About() {
  const { about } = portfolioData;

  return (
    <section id="about" className="pt-16 sm:pt-20 pb-16 sm:pb-24 border-t border-border">
      <Reveal>
        <div className="mb-10">
          <SectionHeading number="02" label="ABOUT" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Heading and narrative */}
          <div className="md:col-span-6 lg:col-span-6 space-y-5">
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground font-normal tracking-tight leading-tight">
              A developer <br />
              exploring data.
            </h2>
            {about.paragraphs.map((p, idx) => (
              <p
                key={idx}
                className="text-foreground-secondary text-sm sm:text-base leading-relaxed font-light"
              >
                {p}
              </p>
            ))}
          </div>

          {/* Middle Column: Editorial Double Slash `//` */}
          <div
            className="hidden md:flex md:col-span-1 lg:col-span-1 justify-center pt-2 select-none"
            aria-hidden="true"
          >
            <div className="text-3xl sm:text-4xl font-light text-accent tracking-tighter opacity-80 italic">
              {'//'}
            </div>
          </div>

          {/* Right Column: Highlights list */}
          <div className="md:col-span-5 lg:col-span-5 pt-1 md:pt-4">
            <ul className="space-y-3 font-mono text-xs sm:text-sm text-foreground-secondary">
              {about.highlights.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 transition-colors hover:text-foreground"
                >
                  <span className="text-accent">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
