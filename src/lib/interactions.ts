import { portfolioData } from '@/data/portfolio';
import { PROJECTS } from '@/data/projects';

export const ALLOWED_EVENT_TYPES = [
  'social_click',
  'resume_click',
  'project_view',
  'project_github_click',
  'project_external_click',
  'email_click',
  'email_copy',
] as const;

export type InteractionEventType = (typeof ALLOWED_EVENT_TYPES)[number];

export interface TrackPayload {
  type: InteractionEventType;
  target?: string;
}

/**
 * Validates incoming interaction payloads against portfolio whitelists.
 * Prevents arbitrary event types or unrecognized targets from entering MongoDB.
 */
export function validateInteraction(payload: unknown): {
  isValid: boolean;
  sanitized?: { type: InteractionEventType; target?: string };
} {
  if (!payload || typeof payload !== 'object') {
    return { isValid: false };
  }

  const { type, target } = payload as Record<string, unknown>;

  if (typeof type !== 'string' || !ALLOWED_EVENT_TYPES.includes(type as InteractionEventType)) {
    return { isValid: false };
  }

  const eventType = type as InteractionEventType;

  // 1. resume_click, email_click, and email_copy require no target
  if (eventType === 'resume_click' || eventType === 'email_click' || eventType === 'email_copy') {
    return {
      isValid: true,
      sanitized: {
        type: eventType,
        ...(typeof target === 'string' && target.trim() ? { target: target.trim().toLowerCase() } : {}),
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
    return { isValid: true, sanitized: { type: eventType, target: normalizedTarget } };
  }

  // 3. project events: whitelist against existing project slugs
  if (
    eventType === 'project_view' ||
    eventType === 'project_github_click' ||
    eventType === 'project_external_click'
  ) {
    if (typeof target !== 'string') return { isValid: false };
    const validProjects = PROJECTS.map((p) => p.slug.toLowerCase());
    const normalizedTarget = target.trim().toLowerCase();
    if (!validProjects.includes(normalizedTarget)) {
      return { isValid: false };
    }
    return { isValid: true, sanitized: { type: eventType, target: normalizedTarget } };
  }

  return { isValid: false };
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
    const url = '/api/interactions';
    const body = JSON.stringify(payload);

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
