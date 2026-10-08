import { NextRequest, NextResponse } from 'next/server';
import { getInteractionsCollection } from '@/lib/mongodb';
import { validateInteraction } from '@/lib/interactions';


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

    const doc = {
      type: sanitized.type,
      ...(sanitized.target ? { target: sanitized.target } : {}),
      createdAt: new Date(),
    };

    await collection.insertOne(doc);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('Error recording interaction:', err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
