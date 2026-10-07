import React from 'react';
import { IExperience } from '@/types/portfolio';

interface ExperienceItemProps {
  item: IExperience;
  isActive: boolean;
  isLast?: boolean;
}

export function ExperienceItem({ item, isActive, isLast = false }: ExperienceItemProps) {
  return (
    <div className="relative pl-8 sm:pl-10 pb-10 group">
      {/* Background Track Line segment */}
      {!isLast && (
        <div
          className="absolute left-[7px] sm:left-[9px] top-3 bottom-0 w-[1px] bg-border transition-colors duration-200"
          aria-hidden="true"
        />
      )}

      {/* Timeline Dot with Active State */}
      <div
        className={`absolute left-1 sm:left-1.5 top-2.5 w-2.5 h-2.5 rounded-full transition-all duration-300 ${
          isActive
            ? 'bg-accent scale-110 shadow-[0_0_0_3px_var(--surface),0_0_0_4px_var(--accent)]'
            : 'bg-border group-hover:bg-accent/60'
        }`}
        aria-hidden="true"
      />

      <div
        className={`space-y-2 border-b border-border/40 pb-8 transition-opacity duration-300 ${
          isActive ? 'opacity-100' : 'opacity-85'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-semibold text-base sm:text-lg transition-colors duration-200 ${
                isActive ? 'text-foreground' : 'text-foreground/90'
              }`}
            >
              {item.company}
            </span>
            <span className="text-foreground-muted" aria-hidden="true">
              |
            </span>
            <span
              className={`text-sm sm:text-base font-normal transition-colors duration-200 ${
                isActive ? 'text-accent' : 'text-foreground-secondary'
              }`}
            >
              {item.role}
            </span>
          </div>
          <span
            className={`font-mono text-xs shrink-0 transition-colors duration-200 ${
              isActive ? 'text-accent font-medium' : 'text-foreground-muted'
            }`}
          >
            {item.period}
          </span>
        </div>

        <p className="text-foreground-secondary text-sm sm:text-base leading-relaxed max-w-2xl font-light">
          {item.description}
        </p>

        {item.technologies && item.technologies.length > 0 && (
          <div className="pt-1.5 flex flex-wrap gap-2">
            {item.technologies.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[11px] text-foreground-muted bg-surface border border-border/60 px-2 py-0.5 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
