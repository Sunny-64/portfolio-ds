import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, logAdminAction } from '@/lib/auth';
import { getActivitiesCollection } from '@/lib/mongodb';
import { ActivitySchema } from '@/lib/validations/cms';
import { ActivityDocument } from '@/types/cms';

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) return auth.response;

  try {
    const activitiesCollection = await getActivitiesCollection();
    if (!activitiesCollection) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const isCurrent = searchParams.get('isCurrent');

    const filter: Record<string, unknown> = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (isCurrent !== null && isCurrent !== undefined) {
      filter.isCurrent = isCurrent === 'true';
    }

    const activities = await activitiesCollection
      .find(filter)
      .sort({ priority: 1, createdAt: -1 })
      .toArray();

    return NextResponse.json({ activities });
  } catch (err) {
    console.error('Failed to list activities:', err);
    return NextResponse.json({ error: 'Failed to list activities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json().catch(() => null);
    const parsed = ActivitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const activitiesCollection = await getActivitiesCollection();
    if (!activitiesCollection) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    const newActivity = {
      ...parsed.data,
      startDate: parsed.data.startDate || null,
      endDate: parsed.data.endDate || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await activitiesCollection.insertOne(newActivity as unknown as ActivityDocument);

    logAdminAction('create_activity', request, {
      type: newActivity.type,
      title: newActivity.title,
      id: result.insertedId.toString(),
    }).catch(() => {});

    return NextResponse.json(
      { ok: true, activity: { _id: result.insertedId, ...newActivity } },
      { status: 201 }
    );
  } catch (err) {
    console.error('Create activity error:', err);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}
