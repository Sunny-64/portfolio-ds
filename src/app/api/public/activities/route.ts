import { NextRequest, NextResponse } from 'next/server';
import { getActivitiesCollection } from '@/lib/mongodb';


export async function GET(request: NextRequest) {
  try {
    const activitiesCollection = await getActivitiesCollection();
    if (!activitiesCollection) {
      return NextResponse.json({ activities: [] });
    }

    const { searchParams } = new URL(request.url);
    const isCurrent = searchParams.get('current');
    const type = searchParams.get('type');

    const filter: Record<string, unknown> = {
      visibility: { $ne: 'private' },
    };

    if (isCurrent === 'true') {
      filter.isCurrent = true;
    }

    if (type) {
      filter.type = type;
    }

    const activities = await activitiesCollection
      .find(filter)
      .sort({ priority: 1, createdAt: -1 })
      .toArray();

    return NextResponse.json({ activities });
  } catch (err) {
    console.error('Public activities fetch error:', err);
    return NextResponse.json({ activities: [] }, { status: 500 });
  }
}
