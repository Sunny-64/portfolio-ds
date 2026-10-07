'use client';

import React, { useSyncExternalStore } from 'react';
import { Sun, Moon } from 'lucide-react';

const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return () => observer.disconnect();
};

const getSnapshot = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

const getServerSnapshot = (): 'light' | 'dark' => 'light';

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:text-accent hover:border-accent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 fill-foreground/10 text-foreground transition-transform duration-200 hover:rotate-12" />
      ) : (
        <Sun className="w-4 h-4 text-foreground transition-transform duration-200 hover:rotate-45" />
      )}
    </button>
  );
}
