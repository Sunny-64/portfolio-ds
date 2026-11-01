'use client';

import React from 'react';
import Image from 'next/image';
import {
  Laptop,
  BookOpen,
  BookText,
  Gamepad2,
  Layers,
  Sparkles,
  Terminal,
  Code,
} from 'lucide-react';
import {
  ActivityDocument,
  ReadingMetadata,
  GamingMetadata,
  SectionCardDocument,
} from '@/types/cms';

interface ActivityPreviewProps {
  activity?: Partial<ActivityDocument>;
  card?: Partial<SectionCardDocument>;
}

export function ActivityPreview({ activity, card }: ActivityPreviewProps) {
  // Can be rendered for an activity or for a section card
  const category = (card?.category || activity?.type || 'learning') as
    | 'project'
    | 'learning'
    | 'reading'
    | 'gaming';

  const defaultCategoryImages = {
    project: '/images/now/working-on-empty.svg',
    learning: '/images/now/learning.svg',
    reading: '/images/now/roald-dahl.jpg',
    gaming: '/images/now/nier-automata.jpg',
  };

  const defaultTitles = {
    project: 'Working On',
    learning: 'Learning',
    reading: 'Reading',
    gaming: 'Playing',
  };

  const title = card?.title || defaultTitles[category];
  const subtitle =
    card?.subtitle ||
    activity?.title ||
    (category === 'project'
      ? 'Standby Mode'
      : category === 'learning'
      ? 'Data Science & Analytics'
      : category === 'reading'
      ? 'Short Stories Collection'
      : 'NieR:Automata');

  const readingMeta = (activity?.metadata || {}) as ReadingMetadata;
  const gamingMeta = (activity?.metadata || {}) as GamingMetadata;

  const description =
    card?.description ||
    activity?.description ||
    (category === 'project'
      ? 'Nothing in progress right now.'
      : category === 'learning'
      ? 'Currently focusing on Excel, SQL and Python.'
      : category === 'reading'
      ? readingMeta.author
        ? `by ${readingMeta.author}`
        : 'by Roald Dahl'
      : gamingMeta.platform || 'Game of the YoRHa Edition');

  const coverImage =
    card?.coverImage || activity?.coverImage || defaultCategoryImages[category];
  const iconName = card?.iconName || category;

  const renderIcon = (name: string) => {
    const key = name.toLowerCase();
    const className = 'w-6 h-6';

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
    <div className="space-y-1.5 w-full max-w-[240px]">
      <div className="text-[10px] font-mono uppercase tracking-wider text-foreground-muted flex items-center justify-between">
        <span>Live Preview</span>
        <span className="text-accent text-[9px]">What I&apos;m Upto</span>
      </div>

      <div className="w-full p-4 rounded-xl border border-border/80 bg-surface/60 transition-all flex flex-col justify-between shadow-lg">
        {/* Compact 2:3 aspect ratio floating image */}
        <div className="flex-1 flex items-center justify-center pt-0.5 pb-2.5">
          {coverImage ? (
            <div className="relative w-[90px] aspect-[2/3] shrink-0 rounded-lg overflow-hidden shadow-sm shadow-black/20 border border-border/50">
              <Image
                src={coverImage}
                alt={`${title} cover`}
                fill
                sizes="90px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-[90px] aspect-[2/3] rounded-lg border border-dashed border-border flex items-center justify-center text-foreground-muted text-[10px] font-mono">
              No Cover
            </div>
          )}
        </div>

        {/* Bottom row: Icon on left, Title + Subtitle + Description on right */}
        <div className="flex items-start gap-2.5 pt-1.5 border-t border-border/40">
          <div className="text-accent shrink-0 mt-0.5">
            {renderIcon(iconName)}
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <h3 className="font-semibold text-foreground text-xs tracking-tight leading-tight truncate">
              {title}
            </h3>
            <div className="text-[11px] text-accent font-normal leading-tight truncate">
              {subtitle}
            </div>
            <p className="text-[10px] text-foreground-muted font-light leading-tight truncate">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
