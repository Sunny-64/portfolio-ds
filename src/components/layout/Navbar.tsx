'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { getNavItems } from '@/data/portfolio';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const items = useMemo(() => getNavItems(), []);

  return (
    <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-sm border-b border-border/50 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="#intro"
          className="font-bold tracking-wider text-sm sm:text-base text-foreground uppercase hover:text-accent transition-colors duration-200"
        >
          B SUNNY
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-7 text-xs font-medium tracking-wide uppercase"
          aria-label="Main Navigation"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-foreground-secondary hover:text-accent transition-colors duration-200 ${
                item.href === '#intro' ? 'text-accent' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right actions: ThemeToggle + Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-md text-foreground-secondary hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 py-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 font-mono text-sm tracking-wider uppercase">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1 text-foreground-secondary hover:text-accent transition-colors ${
                  item.href === '#intro' ? 'text-accent' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
