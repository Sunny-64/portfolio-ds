import { MongoClient, Db, Collection } from 'mongodb';

export interface InteractionDocument {
  type: string;
  target?: string;
  createdAt: Date;
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

/**
 * Returns the 'interactions' collection with verified indexes.
 */
export async function getInteractionsCollection(): Promise<Collection<InteractionDocument> | null> {
  const client = await getMongoClient();
  if (!client) {
    return null;
  }

  try {
    const db: Db = client.db(process.env.MONGODB_DB_NAME || 'portfolio');
    const collection = db.collection<InteractionDocument>('interactions');

    if (!cached.indexesCreated) {
      cached.indexesCreated = true;
      collection
        .createIndexes([
          { key: { createdAt: -1 }, name: 'createdAt_desc' },
          { key: { type: 1, target: 1 }, name: 'type_target' },
          { key: { type: 1, createdAt: -1 }, name: 'type_createdAt_desc' },
        ])
        .catch((err) => {
          console.error('MongoDB index creation notice:', err instanceof Error ? err.message : err);
        });
    }

    return collection;
  } catch (err) {
    console.error('Failed to get interactions collection:', err instanceof Error ? err.message : err);
    return null;
  }
}
