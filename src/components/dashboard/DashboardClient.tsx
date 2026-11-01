'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Activity,
  Layers,
  LogOut,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { InteractionsSection } from './InteractionsSection';
import { SectionManagement } from './SectionManagement';

interface DashboardClientProps {
  adminEmail: string;
}

export function DashboardClient({ adminEmail }: DashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'interactions' | 'sections'>('interactions');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-foreground">
                Sunny&apos;s Portfolio CMS
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                ADMIN
              </span>
            </div>
          </div>

          {/* Navigation: ONLY TWO PRIMARY SECTIONS */}
          <nav className="flex items-center gap-1 bg-surface-elevated/80 border border-border/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('interactions')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 ${
                activeTab === 'interactions'
                  ? 'bg-accent text-white font-medium shadow-sm'
                  : 'text-foreground-secondary hover:text-foreground'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Interactions</span>
            </button>

            <button
              onClick={() => setActiveTab('sections')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 ${
                activeTab === 'sections'
                  ? 'bg-accent text-white font-medium shadow-sm'
                  : 'text-foreground-secondary hover:text-foreground'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Section Management</span>
            </button>
          </nav>

          {/* User profile & actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              title="Open public portfolio"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono text-foreground-secondary hover:text-accent transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <span className="hidden lg:inline-block text-[11px] font-mono text-foreground-muted px-2 py-1 bg-surface-elevated rounded-lg border border-border/60 truncate max-w-[150px]">
              {adminEmail}
            </span>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              title="Sign Out"
              className="p-2 rounded-xl text-foreground-secondary hover:text-red-400 hover:bg-red-500/10 border border-border/60 transition-colors disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'interactions' ? <InteractionsSection /> : <SectionManagement />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 text-center text-xs font-mono text-foreground-muted">
        Private Administration Dashboard • Authenticated Session Active
      </footer>
    </div>
  );
}
