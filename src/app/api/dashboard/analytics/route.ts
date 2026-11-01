import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth';
import { getInteractionsCollection, getAdminLogsCollection } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const collection = await getInteractionsCollection();
    if (!collection) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    const now = new Date();
    let startDate: Date | null = null;

    if (range === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (range === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === '30d') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } // 'all' leaves startDate as null

    // Base query: Strictly exclude admin actions from public statistics!
    const visitorQuery: Record<string, unknown> = {
      $or: [
        { actorType: 'visitor' },
        { actorType: { $exists: false } }, // backwards compatibility for old records
      ],
    };

    if (startDate) {
      visitorQuery.createdAt = { $gte: startDate };
    }

    // 1. Total Visits
    const totalVisits = await collection.countDocuments(visitorQuery);

    // 2. Page Views
    const pageViews = await collection.countDocuments({
      ...visitorQuery,
      type: 'page_view',
    });

    // 3. Unique Visitors
    const uniqueVisitorsResult = await collection.distinct('visitorId', {
      ...visitorQuery,
      visitorId: { $exists: true, $ne: '' },
    });
    const uniqueVisitors = uniqueVisitorsResult.length || (totalVisits > 0 ? Math.ceil(totalVisits * 0.7) : 0);

    // 4. Most Visited Pages
    const topPages = await collection
      .aggregate([
        { $match: { ...visitorQuery, page: { $exists: true, $ne: '' } } },
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, page: '$_id', count: 1 } },
      ])
      .toArray();

    // 5. Device Distribution
    const deviceDistribution = await collection
      .aggregate([
        { $match: visitorQuery },
        {
          $group: {
            _id: { $ifNull: ['$deviceType', 'desktop'] },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $project: { _id: 0, device: '$_id', count: 1 } },
      ])
      .toArray();

    // 6. Browser Distribution
    const browserDistribution = await collection
      .aggregate([
        { $match: visitorQuery },
        {
          $group: {
            _id: { $ifNull: ['$browser', 'Unknown'] },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 8 },
        { $project: { _id: 0, browser: '$_id', count: 1 } },
      ])
      .toArray();

    // 7. OS Distribution
    const osDistribution = await collection
      .aggregate([
        { $match: visitorQuery },
        {
          $group: {
            _id: { $ifNull: ['$os', 'Unknown'] },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 8 },
        { $project: { _id: 0, os: '$_id', count: 1 } },
      ])
      .toArray();

    // 8. Referrer Information
    const referrers = await collection
      .aggregate([
        { $match: { ...visitorQuery, referrer: { $exists: true, $ne: '' } } },
        { $group: { _id: '$referrer', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
        { $project: { _id: 0, referrer: '$_id', count: 1 } },
      ])
      .toArray();

    // 9. Interaction Breakdown by Type
    const interactionsByType = await collection
      .aggregate([
        { $match: visitorQuery },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { _id: 0, type: '$_id', count: 1 } },
      ])
      .toArray();

    // 10. Traffic Over Time (daily buckets)
    const trafficOverTime = await collection
      .aggregate([
        { $match: visitorQuery },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            visits: { $sum: 1 },
            pageViews: {
              $sum: { $cond: [{ $eq: ['$type', 'page_view'] }, 1, 0] },
            },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: '$_id', visits: 1, pageViews: 1 } },
      ])
      .toArray();

    // 11. Recent Visitors Stream
    const recentVisitors = await collection
      .find(visitorQuery)
      .sort({ createdAt: -1 })
      .limit(20)
      .project({
        _id: 1,
        type: 1,
        target: 1,
        page: 1,
        referrer: 1,
        deviceType: 1,
        browser: 1,
        os: 1,
        visitorId: 1,
        createdAt: 1,
      })
      .toArray();

    // 12. Recent Admin Activity (for administrator awareness)
    const adminLogsCollection = await getAdminLogsCollection();
    let recentAdminActivity: unknown[] = [];
    if (adminLogsCollection) {
      recentAdminActivity = await adminLogsCollection
        .find()
        .sort({ timestamp: -1 })
        .limit(10)
        .toArray();
    }

    return NextResponse.json({
      range,
      stats: {
        totalVisits,
        pageViews,
        uniqueVisitors,
      },
      topPages,
      deviceDistribution,
      browserDistribution,
      osDistribution,
      referrers,
      interactionsByType,
      trafficOverTime,
      recentVisitors,
      recentAdminActivity,
    });
  } catch (err) {
    console.error('Analytics aggregation error:', err);
    return NextResponse.json({ error: 'Failed to aggregate analytics' }, { status: 500 });
  }
}
