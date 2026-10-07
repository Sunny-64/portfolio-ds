import React from 'react';
import { ExperienceItemData } from '@/types/portfolio';

interface ExperienceItemProps {
  item: ExperienceItemData;
  isLast?: boolean;
}

export function ExperienceItem({ item, isLast = false }: ExperienceItemProps) {
  return (
    <div className="relative pl-8 sm:pl-10 pb-10 group">
      {/* Timeline line */}
      {!isLast && (
        <div
          className="absolute left-[7px] sm:left-[9px] top-3 bottom-0 w-[1px] bg-border transition-colors duration-200"
          aria-hidden="true"
        />
      )}

      {/* Timeline Dot */}
      <div
        className="absolute left-1 sm:left-1.5 top-2.5 w-2.5 h-2.5 rounded-full bg-accent transition-transform duration-200 group-hover:scale-125"
        aria-hidden="true"
      />

      <div className="space-y-2 border-b border-border/40 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground text-base sm:text-lg">
              {item.company}
            </span>
            <span className="text-foreground-muted" aria-hidden="true">
              |
            </span>
            <span className="text-foreground-secondary text-sm sm:text-base font-normal">
              {item.role}
            </span>
          </div>
          <span className="font-mono text-xs text-foreground-muted shrink-0">
            {item.period}
          </span>
        </div>
        <p className="text-foreground-secondary text-sm sm:text-base leading-relaxed max-w-2xl font-light">
          {item.description}
        </p>
      </div>
    </div>
  );
}
