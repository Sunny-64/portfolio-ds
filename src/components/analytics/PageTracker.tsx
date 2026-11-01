'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackInteraction } from '@/lib/interactions';

export function PageTracker() {
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Only track public paths or non-api paths
    if (!pathname) return;

    if (lastPathRef.current !== pathname) {
      lastPathRef.current = pathname;
      trackInteraction({
        type: 'page_view',
        page: pathname,
      });
    }
  }, [pathname]);

  return null;
}
