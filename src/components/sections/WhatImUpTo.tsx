'use client';

import React from 'react';
import Image from 'next/image';
import { Laptop, BookOpen, BookText, Gamepad2 } from 'lucide-react';
import { NOW_ITEMS } from '@/data/now';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function WhatImUpTo() {
  return (
    <section id="now" className="pt-16 sm:pt-20 pb-16 sm:pb-24 border-t border-border">
      <Reveal>
        <div className="mb-10 sm:mb-12">
          <SectionHeading
            title="What I'm Upto."
            label="CURRENTLY EXPLORING"
            description="A little look at what I'm working on, learning, reading and enjoying these days."
          />
        </div>

        {/* 4 Cards Grid matching visual reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {NOW_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group p-6 rounded-2xl border border-border/80 bg-surface/50 hover:bg-surface/80 hover:border-accent/60 transition-all duration-200 flex flex-col justify-between"
            >
              {/* Card 1: Working On (Top icon, bottom details) */}
              {item.id === 'working-on' && (
                <>
                  <div className="text-accent transition-transform duration-200 group-hover:scale-105">
                    <Laptop className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 pt-6">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base tracking-tight leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-foreground-secondary/90 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </>
              )}

              {/* Card 2: Learning (Top icon, bottom details with blue subtitle) */}
              {item.id === 'learning' && (
                <>
                  <div className="text-accent transition-transform duration-200 group-hover:scale-105">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 pt-6">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base tracking-tight leading-tight">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <div className="text-xs sm:text-[13px] text-accent font-normal leading-tight">
                        {item.subtitle}
                      </div>
                    )}
                    <p className="font-mono text-xs text-foreground-secondary/80 pt-0.5">
                      {item.description}
                    </p>
                  </div>
                </>
              )}

              {/* Card 3: Reading (Centered floating portrait cover, bottom icon + details) */}
              {item.id === 'reading' && (
                <>
                  <div className="flex-1 flex items-center justify-center pt-2 pb-6 sm:pb-7">
                    {item.coverImage && (
                      <div className="relative w-[120px] sm:w-[130px] aspect-[2/3] shrink-0 rounded-lg sm:rounded-xl overflow-hidden shadow-md shadow-black/10 dark:shadow-black/50 border border-border/50 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-102">
                        <Image
                          src={item.coverImage}
                          alt={`${item.subtitle || item.title} cover`}
                          fill
                          sizes="130px"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-3 sm:gap-3.5 pt-2">
                    <div className="text-accent shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-105">
                      <BookText className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <div className="space-y-0.5 sm:space-y-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base tracking-tight leading-tight">
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <div className="text-xs sm:text-[13px] text-accent font-normal leading-tight">
                          {item.subtitle}
                        </div>
                      )}
                      <p className="text-xs text-foreground-muted font-light leading-tight">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Card 4: Playing (Centered floating portrait cover, bottom icon + details) */}
              {item.id === 'playing' && (
                <>
                  <div className="flex-1 flex items-center justify-center pt-2 pb-6 sm:pb-7">
                    {item.coverImage && (
                      <div className="relative w-[120px] sm:w-[130px] aspect-[2/3] shrink-0 rounded-lg sm:rounded-xl overflow-hidden shadow-md shadow-black/10 dark:shadow-black/50 border border-border/50 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-102">
                        <Image
                          src={item.coverImage}
                          alt={`${item.subtitle || item.title} cover art`}
                          fill
                          sizes="130px"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-3 sm:gap-3.5 pt-2">
                    <div className="text-accent shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-105">
                      <Gamepad2 className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <div className="space-y-0.5 sm:space-y-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base tracking-tight leading-tight">
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <div className="text-xs sm:text-[13px] text-accent font-normal leading-tight">
                          {item.subtitle}
                        </div>
                      )}
                      <p className="text-xs text-foreground-muted font-light leading-tight">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
