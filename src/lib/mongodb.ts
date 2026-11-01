import { MongoClient, Db, Collection } from 'mongodb';
import {
  ActivityDocument,
  AssetDocument,
  InteractionDocumentExtended,
  AdminLogDocument,
  SectionCardDocument,
} from '@/types/cms';

export interface InteractionDocument {
  type: string;
  target?: string;
  page?: string;
  referrer?: string;
  visitorId?: string;
  sessionId?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  os?: string;
  browser?: string;
  actorType?: 'visitor' | 'admin';
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface LoginAttemptDocument {
  ipKey: string;
  count: number;
  lastAttempt: Date;
}

const uri = process.env.MONGODB_URI || '';

interface MongoCache {
  client: MongoClient | null;
  promise: Promise<MongoClient | null> | null;
  indexesCreated: boolean;
}

declare global {
  var _mongoClientCache: MongoCache | undefined;
}

const cached: MongoCache = global._mongoClientCache || {
  client: null,
  promise: null,
  indexesCreated: false,
};

if (!global._mongoClientCache) {
  global._mongoClientCache = cached;
}

/**
 * Connects to MongoDB Atlas using a cached client instance across serverless invocations.
 * Returns null safely if MONGODB_URI is not provided or if the connection fails.
 */
export async function getMongoClient(): Promise<MongoClient | null> {
  if (!uri || uri.trim() === '') {
    return null;
  }

  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    cached.promise = client
      .connect()
      .then((c) => {
        cached.client = c;
        return c;
      })
      .catch((err) => {
        cached.promise = null;
        console.error('MongoDB connection error:', err instanceof Error ? err.message : err);
        return null;
      });
  }

  return cached.promise;
}

export async function getDb(): Promise<Db | null> {
  const client = await getMongoClient();
  if (!client) return null;
  return client.db(process.env.MONGODB_DB_NAME || 'portfolio');
}

/**
 * Returns the 'interactions' collection with verified indexes.
 */
export async function getInteractionsCollection(): Promise<Collection<InteractionDocumentExtended> | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const collection = db.collection<InteractionDocumentExtended>('interactions');

    if (!cached.indexesCreated) {
      cached.indexesCreated = true;
      collection
        .createIndexes([
          { key: { createdAt: -1 }, name: 'createdAt_desc' },
          { key: { type: 1, target: 1 }, name: 'type_target' },
          { key: { type: 1, createdAt: -1 }, name: 'type_createdAt_desc' },
          { key: { actorType: 1, createdAt: -1 }, name: 'actorType_createdAt_desc' },
          { key: { visitorId: 1, createdAt: -1 }, name: 'visitorId_createdAt_desc' },
        ])
        .catch((err) => {
          console.error('MongoDB interactions index creation notice:', err instanceof Error ? err.message : err);
        });
    }

    return collection;
  } catch (err) {
    console.error('Failed to get interactions collection:', err instanceof Error ? err.message : err);
    return null;
  }
}

/**
 * Returns the 'activities' collection with verified indexes.
 */
export async function getActivitiesCollection(): Promise<Collection<ActivityDocument> | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const collection = db.collection<ActivityDocument>('activities');

    collection
      .createIndexes([
        { key: { type: 1, isCurrent: 1, priority: 1 }, name: 'type_current_priority' },
        { key: { status: 1 }, name: 'status_idx' },
        { key: { isCurrent: 1 }, name: 'isCurrent_idx' },
        { key: { isFeatured: 1 }, name: 'isFeatured_idx' },
        { key: { priority: 1 }, name: 'priority_idx' },
        { key: { createdAt: -1 }, name: 'createdAt_desc' },
      ])
      .catch((err) => {
        console.error('MongoDB activities index creation notice:', err instanceof Error ? err.message : err);
      });

    return collection;
  } catch (err) {
    console.error('Failed to get activities collection:', err instanceof Error ? err.message : err);
    return null;
  }
}

/**
 * Returns the 'assets' collection with verified indexes.
 */
export async function getAssetsCollection(): Promise<Collection<AssetDocument> | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const collection = db.collection<AssetDocument>('assets');

    collection
      .createIndexes([
        { key: { publicId: 1 }, unique: true, name: 'publicId_unique' },
        { key: { assetId: 1 }, sparse: true, name: 'assetId_idx' },
        { key: { createdAt: -1 }, name: 'createdAt_desc' },
      ])
      .catch((err) => {
        console.error('MongoDB assets index creation notice:', err instanceof Error ? err.message : err);
      });

    return collection;
  } catch (err) {
    console.error('Failed to get assets collection:', err instanceof Error ? err.message : err);
    return null;
  }
}

/**
 * Returns the 'admin_logs' collection with verified indexes.
 */
export async function getAdminLogsCollection(): Promise<Collection<AdminLogDocument> | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const collection = db.collection<AdminLogDocument>('admin_logs');

    collection
      .createIndexes([
        { key: { timestamp: -1 }, name: 'timestamp_desc' },
        { key: { action: 1 }, name: 'action_idx' },
      ])
      .catch((err) => {
        console.error('MongoDB admin_logs index creation notice:', err instanceof Error ? err.message : err);
      });

    return collection;
  } catch (err) {
    console.error('Failed to get admin_logs collection:', err instanceof Error ? err.message : err);
    return null;
  }
}

/**
 * Returns the 'login_attempts' collection for rate limiting.
 */
export async function getLoginAttemptsCollection(): Promise<Collection<LoginAttemptDocument> | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const collection = db.collection<LoginAttemptDocument>('login_attempts');

    collection
      .createIndexes([
        { key: { ipKey: 1 }, unique: true, name: 'ipKey_unique' },
        { key: { lastAttempt: 1 }, expireAfterSeconds: 900, name: 'ttl_15m' }, // auto-expire after 15m
      ])
      .catch(() => {});

    return collection;
  } catch {
    return null;
  }
}

/**
 * Returns the 'section_cards' collection for What I'm Upto homepage cards customization.
 */
export async function getSectionCardsCollection(): Promise<Collection<SectionCardDocument> | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const collection = db.collection<SectionCardDocument>('section_cards');

    collection
      .createIndexes([
        { key: { category: 1 }, unique: true, name: 'category_unique' },
        { key: { order: 1 }, name: 'order_idx' },
      ])
      .catch((err) => {
        console.error('MongoDB section_cards index creation notice:', err instanceof Error ? err.message : err);
      });

    return collection;
  } catch (err) {
    console.error('Failed to get section_cards collection:', err instanceof Error ? err.message : err);
    return null;
  }
}
