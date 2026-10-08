'use client';

import React, { useState, useMemo, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { getNavItems } from '@/data/portfolio';
import { ThemeToggle } from './ThemeToggle';

const emptySubscribe = () => () => {};

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const items = useMemo(() => getNavItems(), []);
  const shouldReduceMotion = useReducedMotion();

  // Prevent background page scrolling while mobile menu is open, preserving scroll position
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [mobileMenuOpen]);

  // Close menu on Escape key press
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Close menu if viewport resizes to desktop breakpoint (md: >= 768px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-background/90 backdrop-blur-sm border-b border-border/50 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
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

      {/* Mobile Menu Overlay */}
      {isMounted &&
        createPortal(
          <AnimatePresence>
            {mobileMenuOpen && (
              <div className="fixed inset-x-0 top-16 bottom-0 z-40 md:hidden flex flex-col">
                {/* Backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: 'easeOut' }}
                  className="absolute inset-0 bg-background/60 backdrop-blur-sm"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-hidden="true"
                />

                {/* Animated Menu Panel */}
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.28,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative z-10 border-b border-border bg-surface px-4 py-6 shadow-xl space-y-4"
                >
                  <nav className="flex flex-col space-y-3 font-mono text-sm tracking-wider uppercase">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                        transition={{
                          duration: shouldReduceMotion ? 0 : 0.22,
                          delay: shouldReduceMotion ? 0 : 0.04 + index * 0.025,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block py-1 text-foreground-secondary hover:text-accent transition-colors ${
                            item.href === '#intro' ? 'text-accent' : ''
                          }`}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </header>
  );
}
