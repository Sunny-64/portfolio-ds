'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Eye,
  Activity,
  Globe,
  Compass,
  Clock,
  Calendar,
  Loader2,
  RefreshCw,
  Monitor,
} from 'lucide-react';

interface AnalyticsData {
  range: string;
  stats: {
    totalVisits: number;
    pageViews: number;
    uniqueVisitors: number;
  };
  topPages: { page: string; count: number }[];
  deviceDistribution: { device: string; count: number }[];
  browserDistribution: { browser: string; count: number }[];
  osDistribution: { os: string; count: number }[];
  referrers: { referrer: string; count: number }[];
  interactionsByType: { type: string; count: number }[];
  trafficOverTime: { date: string; visits: number; pageViews: number }[];
  recentVisitors: {
    _id: string;
    type: string;
    target?: string;
    page: string;
    referrer?: string;
    deviceType?: string;
    browser?: string;
    os?: string;
    visitorId?: string;
    createdAt: string;
  }[];
}

export function InteractionsSection() {
  const [range, setRange] = useState<'today' | '7d' | '30d' | 'all'>('7d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (selectedRange = range) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/dashboard/analytics?range=${selectedRange}`);
      if (!res.ok) {
        throw new Error('Failed to load analytics');
      }
      const json = await res.json();
      setData(json);
    } catch {
      setError('Unable to load analytics data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    fetch(`/api/dashboard/analytics?range=${range}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load analytics');
        return res.json();
      })
      .then((json: AnalyticsData) => {
        if (isMounted) {
          setData(json);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Unable to load analytics data.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [range]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Time Range Selector & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Visitor Interactions</h2>
          <p className="text-xs text-foreground-secondary font-mono">
            Direct tracking of public visits, devices, and portfolio interactions (excluding admin activity)
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex bg-surface-elevated border border-border rounded-xl p-1 text-xs font-mono">
            {(['today', '7d', '30d', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  range === r
                    ? 'bg-accent text-white font-medium shadow-sm'
                    : 'text-foreground-secondary hover:text-foreground'
                }`}
              >
                {r === 'today' ? 'Today' : r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : 'All Time'}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchAnalytics(range)}
            title="Refresh analytics"
            className="p-2 rounded-xl border border-border bg-surface-elevated text-foreground-secondary hover:text-foreground transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-accent' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl border border-border/80 bg-surface/50 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-foreground-secondary">
            <span className="text-xs font-mono uppercase tracking-wider">Total Interactions</span>
            <Activity className="w-4 h-4 text-accent" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-foreground font-mono">
            {isLoading ? '—' : data?.stats.totalVisits.toLocaleString()}
          </div>
          <p className="text-[11px] text-foreground-muted font-mono">Recorded public visitor events</p>
        </div>

        <div className="p-6 rounded-2xl border border-border/80 bg-surface/50 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-foreground-secondary">
            <span className="text-xs font-mono uppercase tracking-wider">Unique Visitors</span>
            <Users className="w-4 h-4 text-accent" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-foreground font-mono">
            {isLoading ? '—' : data?.stats.uniqueVisitors.toLocaleString()}
          </div>
          <p className="text-[11px] text-foreground-muted font-mono">Unique anonymous client sessions</p>
        </div>

        <div className="p-6 rounded-2xl border border-border/80 bg-surface/50 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-foreground-secondary">
            <span className="text-xs font-mono uppercase tracking-wider">Page Views</span>
            <Eye className="w-4 h-4 text-accent" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-foreground font-mono">
            {isLoading ? '—' : data?.stats.pageViews.toLocaleString()}
          </div>
          <p className="text-[11px] text-foreground-muted font-mono">Total route views rendered</p>
        </div>
      </div>

      {/* Traffic Over Time Chart */}
      <div className="p-6 rounded-2xl border border-border/80 bg-surface/50 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            Traffic Activity Over Time
          </h3>
          <span className="text-[11px] font-mono text-foreground-muted">Daily breakdown</span>
        </div>

        {isLoading ? (
          <div className="h-44 flex items-center justify-center text-foreground-muted text-xs font-mono">
            <Loader2 className="w-5 h-5 animate-spin text-accent mr-2" /> Loading timeline...
          </div>
        ) : !data?.trafficOverTime || data.trafficOverTime.length === 0 ? (
          <div className="h-44 flex items-center justify-center text-foreground-muted text-xs font-mono border border-dashed border-border rounded-xl">
            No visitor traffic recorded in this timeframe yet.
          </div>
        ) : (
          <div className="space-y-2">
            <div className="h-44 flex items-end gap-2 pt-6 pb-2 border-b border-border/60 overflow-x-auto">
              {(() => {
                const maxVal = Math.max(...data.trafficOverTime.map((d) => d.visits), 1);
                return data.trafficOverTime.map((item) => {
                  const heightPercent = Math.max(10, Math.round((item.visits / maxVal) * 100));
                  return (
                    <div
                      key={item.date}
                      className="flex-1 min-w-[28px] max-w-[48px] flex flex-col items-center gap-1.5 group relative"
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-elevated border border-border text-[10px] font-mono px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-10 text-foreground">
                        {item.date}: {item.visits} visits ({item.pageViews} views)
                      </div>

                      {/* Bar */}
                      <div className="w-full bg-surface-elevated rounded-t-md h-32 flex items-end overflow-hidden">
                        <div
                          className="w-full bg-accent hover:bg-accent-hover transition-all duration-300 rounded-t-md"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>

                      {/* Date label */}
                      <span className="text-[9px] font-mono text-foreground-muted truncate w-full text-center">
                        {item.date.slice(5)}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
            <div className="flex items-center justify-end gap-4 text-[10px] font-mono text-foreground-muted pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-accent inline-block" /> Visits
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Most Visited Pages */}
        <div className="p-6 rounded-2xl border border-border/80 bg-surface/50 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Compass className="w-4 h-4 text-accent" /> Top Pages
          </h3>
          <div className="space-y-2.5">
            {isLoading ? (
              <p className="text-xs text-foreground-muted font-mono">Loading...</p>
            ) : !data?.topPages || data.topPages.length === 0 ? (
              <p className="text-xs text-foreground-muted font-mono">No page views recorded yet</p>
            ) : (
              data.topPages.map((p) => (
                <div key={p.page} className="flex items-center justify-between text-xs">
                  <span className="font-mono text-foreground-secondary truncate max-w-[180px]">
                    {p.page}
                  </span>
                  <span className="font-mono text-foreground font-medium bg-surface-elevated px-2 py-0.5 rounded border border-border/60">
                    {p.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Devices & Platforms */}
        <div className="p-6 rounded-2xl border border-border/80 bg-surface/50 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Monitor className="w-4 h-4 text-accent" /> Device Distribution
          </h3>
          <div className="space-y-2.5">
            {isLoading ? (
              <p className="text-xs text-foreground-muted font-mono">Loading...</p>
            ) : !data?.deviceDistribution || data.deviceDistribution.length === 0 ? (
              <p className="text-xs text-foreground-muted font-mono">No device data</p>
            ) : (
              data.deviceDistribution.map((d) => {
                const total = data.stats.totalVisits || 1;
                const pct = Math.round((d.count / total) * 100);
                return (
                  <div key={d.device} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="capitalize text-foreground-secondary font-mono">
                        {d.device}
                      </span>
                      <span className="font-mono text-foreground-muted text-[11px]">
                        {d.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Browser & OS */}
        <div className="p-6 rounded-2xl border border-border/80 bg-surface/50 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Globe className="w-4 h-4 text-accent" /> Browsers & OS
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-mono uppercase text-foreground-muted mb-1.5">Top Browsers</p>
              <div className="space-y-1.5">
                {data?.browserDistribution.slice(0, 3).map((b) => (
                  <div key={b.browser} className="flex items-center justify-between text-xs">
                    <span className="font-mono text-foreground-secondary truncate max-w-[140px]">
                      {b.browser}
                    </span>
                    <span className="font-mono text-foreground-muted text-[11px]">{b.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-border/60">
              <p className="text-[10px] font-mono uppercase text-foreground-muted mb-1.5">Operating Systems</p>
              <div className="space-y-1.5">
                {data?.osDistribution.slice(0, 3).map((o) => (
                  <div key={o.os} className="flex items-center justify-between text-xs">
                    <span className="font-mono text-foreground-secondary truncate max-w-[140px]">
                      {o.os}
                    </span>
                    <span className="font-mono text-foreground-muted text-[11px]">{o.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Visitors Activity Stream */}
      <div className="p-6 rounded-2xl border border-border/80 bg-surface/50 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" /> Recent Visitor Activity
          </h3>
          <span className="text-xs font-mono text-foreground-muted">Latest 20 events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border/60 text-foreground-muted text-[11px]">
                <th className="pb-2 font-normal">Timestamp</th>
                <th className="pb-2 font-normal">Event Type</th>
                <th className="pb-2 font-normal">Route / Target</th>
                <th className="pb-2 font-normal">Device & Browser</th>
                <th className="pb-2 font-normal">OS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-foreground-muted">
                    Loading activity stream...
                  </td>
                </tr>
              ) : !data?.recentVisitors || data.recentVisitors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-foreground-muted">
                    No recent events found.
                  </td>
                </tr>
              ) : (
                data.recentVisitors.map((v) => (
                  <tr key={v._id} className="hover:bg-surface-elevated/40 transition-colors">
                    <td className="py-2.5 text-foreground-muted whitespace-nowrap">
                      {new Date(v.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-surface-elevated border border-border text-[10px] text-accent">
                        {v.type}
                      </span>
                    </td>
                    <td className="py-2.5 text-foreground font-medium max-w-[200px] truncate">
                      {v.page} {v.target ? `(${v.target})` : ''}
                    </td>
                    <td className="py-2.5 text-foreground-secondary">
                      {v.deviceType || 'desktop'} • {v.browser || 'Unknown'}
                    </td>
                    <td className="py-2.5 text-foreground-secondary">{v.os || 'Unknown'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
