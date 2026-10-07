import React from 'react';
import { portfolioData } from '@/data/portfolio';

export function Footer() {
  const { footer } = portfolioData;

  return (
    <footer className="border-t border-border mt-16 sm:mt-24 py-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-foreground-muted">
        <div>
          <span>{footer.copyrightName}</span>
          <span className="mx-2">©</span>
          <span>{footer.year}</span>
        </div>
        <div className="tracking-widest uppercase">
          {footer.tagline}
        </div>
      </div>
    </footer>
  );
}
