'use client';

import { useEffect } from 'react';
import { trackInteraction } from '@/lib/interactions';

export function TrackProjectView({ slug }: { slug: string }) {
  useEffect(() => {
    trackInteraction({ type: 'project_view', target: slug });
  }, [slug]);

  return null;
}
