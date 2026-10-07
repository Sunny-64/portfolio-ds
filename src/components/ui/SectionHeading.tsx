import React from 'react';

interface SectionHeadingProps {
  number: string;
  label: string;
  title?: string;
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  number,
  label,
  title,
  className = '',
  titleClassName = '',
}: SectionHeadingProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2 font-mono text-xs tracking-wider">
        <span className="text-accent font-medium">{number}</span>
        <span className="text-foreground-muted">/</span>
        <span className="uppercase text-foreground-secondary">{label}</span>
      </div>
      {title && (
        <h2
          className={`font-serif text-3xl sm:text-4xl text-foreground font-normal tracking-tight ${titleClassName}`}
        >
          {title}
        </h2>
      )}
    </div>
  );
}
