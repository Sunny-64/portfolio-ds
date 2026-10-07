import React from 'react';

interface SkillIconProps {
  name: 'data-analysis' | 'sql' | 'excel' | 'power-bi' | 'python' | 'web-dev';
  className?: string;
}

export function SkillIcon({ name, className = 'w-7 h-7 sm:w-8 sm:h-8' }: SkillIconProps) {
  switch (name) {
    case 'data-analysis':
      return (
        <svg
          viewBox="0 0 32 32"
          fill="currentColor"
          className={`${className} text-foreground dark:text-accent`}
          aria-hidden="true"
        >
          {/* Bar chart: 3 bars */}
          <rect x="4" y="16" width="6" height="12" rx="1.5" />
          <rect x="13" y="10" width="6" height="18" rx="1.5" />
          <rect x="22" y="4" width="6" height="24" rx="1.5" />
        </svg>
      );

    case 'sql':
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          {/* Database cylinders in crisp blue */}
          <ellipse cx="16" cy="7" rx="11" ry="4" className="fill-accent stroke-accent" />
          <path
            d="M5 7v7c0 2.2 4.9 4 11 4s11-1.8 11-4V7"
            className="fill-accent/70 stroke-accent"
            strokeWidth="1"
          />
          <path
            d="M5 14v7c0 2.2 4.9 4 11 4s11-1.8 11-4v-7"
            className="fill-accent/90 stroke-accent"
            strokeWidth="1"
          />
          <path
            d="M5 21v4c0 2.2 4.9 4 11 4s11-1.8 11-4v-4"
            className="fill-accent stroke-accent"
            strokeWidth="1"
          />
        </svg>
      );

    case 'excel':
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          {/* Excel spreadsheet icon */}
          <rect x="10" y="5" width="18" height="22" rx="2" fill="#107C41" />
          <rect x="14" y="9" width="5" height="4" fill="#FFFFFF" opacity="0.3" />
          <rect x="21" y="9" width="5" height="4" fill="#FFFFFF" opacity="0.3" />
          <rect x="14" y="15" width="5" height="4" fill="#FFFFFF" opacity="0.3" />
          <rect x="21" y="15" width="5" height="4" fill="#FFFFFF" opacity="0.3" />
          {/* Foreground folder flap with 'X' */}
          <rect x="4" y="8" width="14" height="16" rx="2" fill="#185ABD" className="fill-[#107C41]" />
          <path
            d="M8 12l6 8M14 12l-6 8"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'power-bi':
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          {/* Power BI ascending steps in gold/yellow */}
          <rect x="6" y="15" width="5.5" height="13" rx="1.5" fill="#F2C811" />
          <rect x="13.5" y="10" width="5.5" height="18" rx="1.5" fill="#ECA500" />
          <rect x="21" y="5" width="5.5" height="23" rx="1.5" fill="#D38200" />
        </svg>
      );

    case 'python':
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          {/* Blue top snake */}
          <path
            d="M15.8 4c-5.7 0-5.3 2.5-5.3 2.5l.01 2.6h5.4v.8H8.3S4 9.4 4 15.2c0 5.7 3.7 5.5 3.7 5.5h2.2v-3.1s-.1-3.7 3.6-3.7h5.5s3.5.1 3.5-3.4V7.5S22.9 4 15.8 4zm-2.8 1.8a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2z"
            fill="#3776AB"
          />
          {/* Yellow bottom snake */}
          <path
            d="M16.2 28c5.7 0 5.3-2.5 5.3-2.5l-.01-2.6h-5.4v-.8h7.6s4.3.5 4.3-5.3c0-5.7-3.7-5.5-3.7-5.5h-2.2v3.1s.1 3.7-3.6 3.7h-5.5s-3.5-.1-3.5 3.4v3.1s-.4 3.5 6.7 3.5zm2.8-1.8a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2z"
            fill="#FFD438"
          />
        </svg>
      );

    case 'web-dev':
      return (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className={`${className} text-foreground`}
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Code brackets </> */}
          <path d="M11 10l-6 6 6 6" />
          <path d="M21 10l6 6-6 6" />
          <path d="M18 7l-4 18" strokeWidth="2" />
        </svg>
      );

    default:
      return null;
  }
}
