import { NextRequest, NextResponse } from 'next/server';
import { getInteractionsCollection } from '@/lib/mongodb';
import { validateInteraction } from '@/lib/interactions';
import { getAdminSession, logAdminAction } from '@/lib/auth';
import { UAParser } from 'ua-parser-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    const { isValid, sanitized } = validateInteraction(body);

    if (!isValid || !sanitized) {
      return NextResponse.json({ error: 'Invalid interaction payload' }, { status: 400 });
    }

    const collection = await getInteractionsCollection();

    if (!collection) {
      // If MongoDB is not configured or temporarily unreachable, respond safely without exposing internals
      return NextResponse.json({ ok: false }, { status: 503 });
    }

    // Determine actorType: strictly verify admin session
    const adminSession = await getAdminSession(request);
    const actorType: 'admin' | 'visitor' = adminSession ? 'admin' : 'visitor';

    // Parse device, OS, and browser from User-Agent
    const userAgent = request.headers.get('user-agent') || '';
    const parser = new UAParser(userAgent);
    const parsedDevice = parser.getDevice();
    const parsedOS = parser.getOS();
    const parsedBrowser = parser.getBrowser();

    const deviceType: 'desktop' | 'mobile' | 'tablet' =
      parsedDevice.type === 'mobile'
        ? 'mobile'
        : parsedDevice.type === 'tablet'
        ? 'tablet'
        : 'desktop';

    const os = parsedOS.name || 'Unknown';
    const browser = parsedBrowser.name || 'Unknown';

    // Get referrer from payload or headers
    const referrer = sanitized.referrer || request.headers.get('referer') || undefined;

    const doc = {
      type: sanitized.type,
      ...(sanitized.target ? { target: sanitized.target } : {}),
      page: sanitized.page || '/',
      referrer: referrer ? referrer.slice(0, 500) : undefined,
      visitorId: sanitized.visitorId,
      sessionId: sanitized.sessionId,
      deviceType,
      os,
      browser,
      actorType,
      metadata: sanitized.metadata,
      createdAt: new Date(),
    };

    await collection.insertOne(doc);

    // If admin action, also log to admin audit trail
    if (actorType === 'admin') {
      logAdminAction(`admin_interaction_${sanitized.type}`, request, {
        target: sanitized.target,
        page: sanitized.page,
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('Error recording interaction:', err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
