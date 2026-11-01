import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, logAdminAction } from '@/lib/auth';
import { getSectionCards, updateSectionCard } from '@/lib/activities';
import { SectionCardDocument } from '@/types/cms';

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) return auth.response;

  try {
    const cards = await getSectionCards();
    return NextResponse.json({ cards });
  } catch (err) {
    console.error('Failed to get section cards:', err);
    return NextResponse.json({ error: 'Failed to retrieve section cards' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) return auth.response;

  try {
    const body = (await request.json().catch(() => null)) as Partial<SectionCardDocument> | null;
    if (!body || !body.category) {
      return NextResponse.json({ error: 'Missing category in payload' }, { status: 400 });
    }

    const updatedCard = await updateSectionCard(body.category, body);
    if (!updatedCard) {
      return NextResponse.json({ error: 'Failed to update section card' }, { status: 500 });
    }

    await logAdminAction('update_section_card', request, {
      category: body.category,
      title: body.title,
    });

    return NextResponse.json({ success: true, card: updatedCard });
  } catch (err) {
    console.error('Failed to update section card:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
