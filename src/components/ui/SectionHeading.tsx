import React from 'react';

interface SectionHeadingProps {
  title: string;
  label?: string;
  description?: string;
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  title,
  label,
  description,
  className = '',
  titleClassName = '',
}: SectionHeadingProps) {
  return (
    <div className={`space-y-2 sm:space-y-3 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 md:gap-8">
        <div>
          {label && (
            <div className="font-mono text-[11px] sm:text-xs tracking-wider uppercase text-foreground-muted mb-1.5 sm:mb-2">
              {label}
            </div>
          )}
          <h2
            className={`font-serif text-3xl sm:text-4xl lg:text-[2.6rem] text-foreground font-normal tracking-tight leading-[1.15] ${titleClassName}`}
          >
            {title}
          </h2>
        </div>

        {description && (
          <p className="font-mono text-xs sm:text-[13px] text-foreground-secondary md:text-right max-w-sm md:max-w-md leading-relaxed pb-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
