import React from 'react';

interface SectionHeadingProps {
  title?: string;
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  title,
  className = '',
  titleClassName = '',
}: SectionHeadingProps) {
  if (!title) return null;

  return (
    <div className={className}>
      <h2
        className={`font-serif text-3xl sm:text-4xl text-foreground font-normal tracking-tight ${titleClassName}`}
      >
        {title}
      </h2>
    </div>
  );
}
