'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Laptop,
  BookOpen,
  BookText,
  Gamepad2,
  ArrowUpRight,
  Layers,
  Sparkles,
  Terminal,
  Code,
} from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { ActivityDocument, SectionCardDocument } from '@/types/cms';
import { getDefaultSectionCards } from '@/lib/cms-cards';

interface WhatImUpToProps {
  initialCards?: SectionCardDocument[];
  initialActivities?: ActivityDocument[];
}

export function WhatImUpTo({ initialCards, initialActivities = [] }: WhatImUpToProps) {
  // Use passed section cards or derive from activities / defaults
  const cards = (
    initialCards && initialCards.length > 0
      ? initialCards
      : getDefaultSectionCards(initialActivities)
  )
    .filter((card) => card.isEnabled !== false)
    .sort((a, b) => a.order - b.order);

  const renderIcon = (iconName: string, category: string) => {
    const key = (iconName || category).toLowerCase();
    const className = 'w-6 h-6 sm:w-7 sm:h-7';

    switch (key) {
      case 'laptop':
      case 'project':
        return <Laptop className={className} />;
      case 'bookopen':
      case 'book-open':
      case 'learning':
        return <BookOpen className={className} />;
      case 'booktext':
      case 'book-text':
      case 'reading':
        return <BookText className={className} />;
      case 'gamepad2':
      case 'gamepad':
      case 'gaming':
        return <Gamepad2 className={className} />;
      case 'sparkles':
        return <Sparkles className={className} />;
      case 'terminal':
        return <Terminal className={className} />;
      case 'code':
        return <Code className={className} />;
      default:
        return <Layers className={className} />;
    }
  };

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

        {/* Standardized 4-card grid: Working On | Learning | Reading | Playing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {cards.map((card) => {
            const isClickable =
              card.linkHref &&
              card.linkHref !== '#' &&
              card.category !== 'learning';

            return (
              <div
                key={card.category}
                className="group p-4 sm:p-5 rounded-2xl border border-border/80 bg-surface/50 hover:bg-surface/80 hover:border-accent/60 transition-all duration-200 flex flex-col justify-between"
              >
                {/* 1. Cover Image: Uniform compact 2:3 aspect ratio floating card */}
                <div className="flex-1 flex items-center justify-center pt-1 pb-3 sm:pb-4">
                  {card.coverImage && (
                    <div className="relative w-[100px] sm:w-[110px] aspect-[2/3] shrink-0 rounded-lg sm:rounded-xl overflow-hidden shadow-md shadow-black/10 dark:shadow-black/50 border border-border/50 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-102">
                      <Image
                        src={card.coverImage}
                        alt={`${card.title} cover`}
                        fill
                        sizes="110px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* 2. Bottom Row: Category Icon on left, Content on right */}
                <div className="flex items-start gap-2.5 sm:gap-3 pt-2">
                  <div className="text-accent shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-105">
                    {renderIcon(card.iconName, card.category)}
                  </div>

                  <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base tracking-tight leading-tight">
                        {card.title}
                      </h3>
                      {isClickable && (
                        <Link
                          href={card.linkHref!}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono text-accent"
                          aria-label={`View ${card.title}`}
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>

                    <div className="text-xs sm:text-[13px] text-accent font-normal leading-tight truncate">
                      {card.subtitle}
                    </div>

                    <p className="text-xs text-foreground-muted font-light leading-tight truncate">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
