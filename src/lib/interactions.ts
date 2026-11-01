import { portfolioData } from '@/data/portfolio';
import { PROJECTS } from '@/data/projects';

export const ALLOWED_EVENT_TYPES = [
  'page_view',
  'social_click',
  'resume_click',
  'project_view',
  'project_github_click',
  'project_external_click',
  'email_click',
  'email_copy',
  'custom_event',
] as const;

export type InteractionEventType = (typeof ALLOWED_EVENT_TYPES)[number];

export interface TrackPayload {
  type: InteractionEventType;
  target?: string;
  page?: string;
  referrer?: string;
  visitorId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Validates incoming interaction payloads against portfolio whitelists.
 * Prevents arbitrary event types or unrecognized targets from entering MongoDB.
 */
export function validateInteraction(payload: unknown): {
  isValid: boolean;
  sanitized?: TrackPayload;
} {
  if (!payload || typeof payload !== 'object') {
    return { isValid: false };
  }

  const { type, target, page, referrer, visitorId, sessionId, metadata } = payload as Record<string, unknown>;

  if (typeof type !== 'string' || !ALLOWED_EVENT_TYPES.includes(type as InteractionEventType)) {
    return { isValid: false };
  }

  const eventType = type as InteractionEventType;

  const baseSanitized: TrackPayload = {
    type: eventType,
    page: typeof page === 'string' && page.length < 200 ? page : undefined,
    referrer: typeof referrer === 'string' && referrer.length < 500 ? referrer : undefined,
    visitorId: typeof visitorId === 'string' && visitorId.length <= 64 ? visitorId : undefined,
    sessionId: typeof sessionId === 'string' && sessionId.length <= 64 ? sessionId : undefined,
    metadata: metadata && typeof metadata === 'object' ? (metadata as Record<string, unknown>) : undefined,
  };

  // 1. page_view, resume_click, email_click, and email_copy require no target
  if (
    eventType === 'page_view' ||
    eventType === 'resume_click' ||
    eventType === 'email_click' ||
    eventType === 'email_copy'
  ) {
    return {
      isValid: true,
      sanitized: {
        ...baseSanitized,
        ...(typeof target === 'string' && target.trim() ? { target: target.trim().toLowerCase().slice(0, 100) } : {}),
      },
    };
  }

  // 2. social_click: whitelist against existing portfolio social platforms (including email)
  if (eventType === 'social_click') {
    if (typeof target !== 'string') return { isValid: false };
    const validSocials = [
      ...portfolioData.contact.socials.map((s) => s.platform.toLowerCase()),
      'email',
    ];
    const normalizedTarget = target.trim().toLowerCase();
    if (!validSocials.includes(normalizedTarget)) {
      return { isValid: false };
    }
    return { isValid: true, sanitized: { ...baseSanitized, target: normalizedTarget } };
  }

  // 3. project events: whitelist against existing project slugs or general string
  if (
    eventType === 'project_view' ||
    eventType === 'project_github_click' ||
    eventType === 'project_external_click'
  ) {
    if (typeof target !== 'string') return { isValid: false };
    const normalizedTarget = target.trim().toLowerCase();
    const validProjects = PROJECTS.map((p) => p.slug.toLowerCase());
    // Also allow new dynamic projects
    if (!validProjects.includes(normalizedTarget) && !/^[a-z0-9_-]{1,80}$/.test(normalizedTarget)) {
      return { isValid: false };
    }
    return { isValid: true, sanitized: { ...baseSanitized, target: normalizedTarget } };
  }

  // 4. Custom events
  if (eventType === 'custom_event') {
    return {
      isValid: true,
      sanitized: {
        ...baseSanitized,
        ...(typeof target === 'string' ? { target: target.trim().slice(0, 100) } : {}),
      },
    };
  }

  return { isValid: false };
}

/**
 * Returns or generates a persistent anonymous visitor ID and session ID from browser storage.
 */
function getClientIds(): { visitorId?: string; sessionId?: string } {
  if (typeof window === 'undefined') return {};

  try {
    let visitorId = localStorage.getItem('_vid');
    if (!visitorId) {
      visitorId = 'v_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      localStorage.setItem('_vid', visitorId);
    }

    let sessionId = sessionStorage.getItem('_sid');
    if (!sessionId) {
      sessionId = 's_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      sessionStorage.setItem('_sid', sessionId);
    }

    return { visitorId, sessionId };
  } catch {
    return {};
  }
}

/**
 * Client-side fire-and-forget interaction tracker.
 *
 * Uses navigator.sendBeacon where available for seamless delivery during navigation,
 * with fetch keepalive as a fallback. Never throws, never blocks the UI, and never awaits.
 */
export function trackInteraction(payload: TrackPayload): void {
  if (typeof window === 'undefined') return;

  try {
    const { visitorId, sessionId } = getClientIds();
    const fullPayload: TrackPayload = {
      ...payload,
      page: payload.page || window.location.pathname,
      referrer: payload.referrer !== undefined ? payload.referrer : document.referrer || undefined,
      visitorId: payload.visitorId || visitorId,
      sessionId: payload.sessionId || sessionId,
    };

    const url = '/api/interactions';
    const body = JSON.stringify(fullPayload);

    // 1. Prefer navigator.sendBeacon for lightweight delivery
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' });
      const sent = navigator.sendBeacon(url, blob);
      if (sent) return;
    }

    // 2. Fallback to fetch with keepalive: true
    if (typeof fetch === 'function') {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {
        // Silently swallow errors
      });
    }
  } catch {
    // Non-critical: failure must remain completely invisible
  }
}
