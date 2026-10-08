'use client';

import React from 'react';
import Link from 'next/link';

interface ArrowLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'inline';
  className?: string;
  external?: boolean;
}

export function ArrowLink({
  href,
  children,
  variant = 'inline',
  className = '',
  external = false,
}: ArrowLinkProps) {
  const baseClasses =
    'group inline-flex items-center gap-1.5 transition-all duration-200 text-sm cursor-pointer select-none';

  const variantClasses = {
    primary:
      'bg-foreground text-background dark:bg-accent dark:text-surface px-5 py-2.5 rounded-lg font-medium hover:bg-foreground/90 dark:hover:bg-accent-hover transition-colors shadow-sm',
    secondary:
      'bg-surface text-foreground border border-border px-5 py-2.5 rounded-lg font-medium hover:border-foreground/30 hover:bg-surface-elevated transition-colors',
    ghost:
      'text-foreground-secondary hover:text-foreground font-medium',
    inline:
      'text-accent hover:text-accent-hover font-medium',
  };

  const isInternalRoute = href.startsWith('/') && !href.startsWith('//');

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', href);
      }
    }
  };

  // For mailto, hash anchor links, or external URLs, use native <a> tag
  if (!isInternalRoute) {
    const isExternal = external || href.startsWith('http');
    const targetProps = isExternal
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {};

    return (
      <a
        href={href}
        onClick={handleClick}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        {...targetProps}
      >
        <span>{children}</span>
        <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">
          →
        </span>
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <span>{children}</span>
      <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}
