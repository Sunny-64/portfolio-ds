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
              className="group p-6 rounded-xl border border-border/80 bg-surface/50 hover:bg-surface/80 hover:border-accent/40 transition-all duration-200 flex flex-col justify-between"
            >
              {/* Card 1: Working On (Top icon + title + description) */}
              {item.id === 'working-on' && (
                <div className="space-y-4">
                  <div className="text-accent transition-transform duration-200 group-hover:scale-105">
                    <Laptop className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground text-base tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-foreground-secondary/90 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Card 2: Learning (Top icon + title + blue subtitle + tech list) */}
              {item.id === 'learning' && (
                <div className="space-y-4">
                  <div className="text-accent transition-transform duration-200 group-hover:scale-105">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground text-base tracking-tight">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <div className="text-xs sm:text-[13px] text-accent font-normal">
                        {item.subtitle}
                      </div>
                    )}
                    <p className="font-mono text-xs text-foreground-secondary/80 pt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Card 3: Reading (Top icon + wide cover image taking remaining horizontal space, bottom details with blue book name) */}
              {item.id === 'reading' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="text-accent shrink-0 transition-transform duration-200 group-hover:scale-105">
                      <BookText className="w-8 h-8" />
                    </div>

                    {item.coverImage && (
                      <div className="relative flex-1 h-20 sm:h-22 overflow-hidden rounded border border-border/60 transition-transform duration-200 group-hover:scale-[1.02]">
                        <Image
                          src={item.coverImage}
                          alt={`${item.subtitle || item.title} cover`}
                          fill
                          sizes="(max-width: 640px) 100vw, 250px"
                          className="object-cover object-[center_30%]"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground text-base tracking-tight">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <div className="text-xs sm:text-[13px] text-accent font-normal">
                        {item.subtitle}
                      </div>
                    )}
                    <p className="text-xs text-foreground-muted font-light">
                      {item.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Card 4: Playing (Top icon + wide cover art taking remaining horizontal space, bottom details with blue game name) */}
              {item.id === 'playing' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="text-accent shrink-0 transition-transform duration-200 group-hover:scale-105">
                      <Gamepad2 className="w-8 h-8" />
                    </div>

                    {item.coverImage && (
                      <div className="relative flex-1 h-20 sm:h-22 overflow-hidden rounded border border-border/60 transition-transform duration-200 group-hover:scale-[1.02]">
                        <Image
                          src={item.coverImage}
                          alt={`${item.subtitle || item.title} cover art`}
                          fill
                          sizes="(max-width: 640px) 100vw, 250px"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground text-base tracking-tight">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <div className="text-xs sm:text-[13px] text-accent font-normal">
                        {item.subtitle}
                      </div>
                    )}
                    <p className="text-xs text-foreground-muted font-light">
                      {item.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
