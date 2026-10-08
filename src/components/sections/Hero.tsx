'use client';

import React from 'react';
import Image from 'next/image';
import { portfolioData } from '@/data/portfolio';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { trackInteraction } from '@/lib/interactions';

export function Hero() {
  const { headline, positioning, heroDescription, resumeUrl, ctaPrimary, ctaSecondary } =
    portfolioData;

  return (
    <section
      id="intro"
      className="min-h-[calc(100vh-4rem)] min-h-[calc(100svh-4rem)] flex flex-col justify-center py-12 sm:py-16 md:py-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Content */}
        <div className="md:col-span-7 lg:col-span-7 space-y-6">
          {/* Primary Headline */}
          <h1 className="animate-hero-2 font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground font-normal tracking-tight leading-[1.12]">
            {headline.line1} <br />
            {headline.line2} <br />
            <span className="text-accent">{headline.accentLine}</span>
          </h1>

          {/* Positioning */}
          <div className="animate-hero-3 text-sm sm:text-base font-semibold tracking-wide text-foreground flex items-center gap-2">
            <span>{positioning.split('×')[0].trim()}</span>
            <span className="text-accent">×</span>
            <span>{positioning.split('×')[1].trim()}</span>
          </div>

          {/* Description */}
          <p className="animate-hero-4 text-foreground-secondary text-sm sm:text-base leading-relaxed max-w-xl font-light">
            {heroDescription}
          </p>

          {/* Buttons */}
          <div className="animate-hero-5 flex flex-wrap items-center gap-3.5 pt-2">
            <ArrowLink href={ctaPrimary.href} variant="primary">
              {ctaPrimary.label}
            </ArrowLink>
            <ArrowLink href={ctaSecondary.href} variant="secondary">
              {ctaSecondary.label}
            </ArrowLink>
          </div>
        </div>

        {/* Right Column: Profile Image Composition */}
        <div className="animate-hero-6 md:col-span-5 lg:col-span-5 flex flex-col items-center md:items-end justify-center">
          <div className="relative w-fit">
            {/* Top-Right Blue Geometric Accent */}
            <div
              className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-14 h-14 sm:w-16 sm:h-16 bg-accent z-0"
              aria-hidden="true"
            />

            {/* Top-Left Dot Grid Matrix */}
            <div
              className="absolute -top-4 -left-10 w-12 h-16 dot-pattern text-foreground-muted/40 z-0 hidden sm:block"
              aria-hidden="true"
            />

            {/* Profile Image Frame */}
            <div className="relative z-10 w-60 sm:w-64 md:w-72 aspect-4/5 bg-surface border border-border shadow-sm overflow-hidden">
              <Image
                src="/images/profile/sunny.png"
                alt="B Sunny - Data Analyst and Software Developer"
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Bottom-Left Dot Grid Matrix */}
            <div
              className="absolute -bottom-6 -left-6 w-14 h-10 dot-pattern text-foreground-muted/40 z-0 hidden sm:block"
              aria-hidden="true"
            />

            {/* Resume Link */}
            <div className="mt-4 text-right">
              <a
                href={resumeUrl || 'https://drive.google.com/file/d/1uDbMH-rGIP4eviZ3H_NzlJXuLC4G-aeg/view?usp=sharing'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackInteraction({ type: 'resume_click' })}
                aria-label="View B Sunny Resume in a new tab"
                className="group inline-flex items-center gap-1.5 font-mono text-[11px] sm:text-xs tracking-widest uppercase text-foreground-secondary hover:text-accent transition-colors"
              >
                <span>Resume</span>
                <span className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-accent font-sans">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
