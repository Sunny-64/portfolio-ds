import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { requireAdminAuth, logAdminAction } from '@/lib/auth';
import { getActivitiesCollection } from '@/lib/mongodb';
import { ActivitySchema } from '@/lib/validations/cms';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const activitiesCollection = await getActivitiesCollection();
    if (!activitiesCollection) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    let query: Record<string, unknown> = {};
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      query = { _id: id };
    }

    const activity = await activitiesCollection.findOne(query);
    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    return NextResponse.json({ activity });
  } catch (err) {
    console.error('Fetch activity error:', err);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
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

    let query: Record<string, unknown> = {};
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      query = { _id: id };
    }

    const updateDoc = {
      ...parsed.data,
      startDate: parsed.data.startDate || null,
      endDate: parsed.data.endDate || null,
      updatedAt: new Date(),
    };

    const updateResult = await activitiesCollection.updateOne(query, {
      $set: updateDoc,
    });

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    logAdminAction('update_activity', request, {
      id,
      title: parsed.data.title,
      type: parsed.data.type,
    }).catch(() => {});

    return NextResponse.json({ ok: true, activity: { _id: id, ...updateDoc } });
  } catch (err) {
    console.error('Update activity error:', err);
    return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const activitiesCollection = await getActivitiesCollection();
    if (!activitiesCollection) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    let query: Record<string, unknown> = {};
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      query = { _id: id };
    }

    const existing = await activitiesCollection.findOne(query);
    if (!existing) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    await activitiesCollection.deleteOne(query);

    logAdminAction('delete_activity', request, {
      id,
      title: existing.title,
      type: existing.type,
    }).catch(() => {});

    return NextResponse.json({ ok: true, message: 'Activity deleted successfully' });
  } catch (err) {
    console.error('Delete activity error:', err);
    return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 });
  }
}
