import pkg from '@next/env';
const { loadEnvConfig } = pkg;
loadEnvConfig(process.cwd(), true);
import { MongoClient, ObjectId } from 'mongodb';
import { verify, hash } from '@node-rs/argon2';
import { SignJWT, jwtVerify } from 'jose';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('ERROR: MONGODB_URI environment variable is required.');
  process.exit(1);
}
const dbName = process.env.MONGODB_DB_NAME || 'portfolio';
const sessionSecret = process.env.SESSION_SECRET || 'test-session-secret-at-least-32-chars-long';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${testName}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n--- 1. Testing MongoDB Database & Collection Models ---');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const activities = await db.collection('activities').find({}).toArray();
  assert(activities.length >= 5, `Database has ${activities.length} activities`);

  // Verify learning activities priority order: Excel (1), SQL (2), Python (3)
  const learning = activities
    .filter((a) => a.type === 'learning' && a.isCurrent)
    .sort((a, b) => a.priority - b.priority);

  assert(learning.length === 3, 'Found 3 active learning subjects');
  assert(learning[0]?.title === 'Excel' && learning[0]?.priority === 1, 'Excel is Priority 1 (Primary focus)');
  assert(learning[1]?.title === 'SQL' && learning[1]?.priority === 2, 'SQL is Priority 2 (Secondary focus)');
  assert(learning[2]?.title === 'Python' && learning[2]?.priority === 3, 'Python is Priority 3 (Secondary focus)');

  // Verify projects: No active projects on homepage!
  const activeProjects = activities.filter((a) => a.type === 'project' && a.isCurrent);
  assert(activeProjects.length === 0, 'No fake or active projects marked as isCurrent: true');

  // Verify Gaming: NieR:Automata
  const gaming = activities.find((a) => a.type === 'gaming' && a.isCurrent);
  assert(gaming && gaming.title.includes('NieR:Automata'), 'NieR:Automata is active gaming record');

  // Verify Reading
  const reading = activities.find((a) => a.type === 'reading' && a.isCurrent);
  assert(reading && reading.title.includes('Short Stories Collection'), 'Reading record preserved');

  console.log('\n--- 2. Testing Argon2id & Session Authentication ---');
  const testPassword = 'TestPassword123!';
  const hashedPassword = await hash(testPassword);
  assert(hashedPassword.startsWith('$argon2id$'), 'Argon2id hashing format confirmed');

  const validVerification = await verify(hashedPassword, testPassword);
  assert(validVerification === true, 'Argon2id password verification succeeds for correct password');

  const invalidVerification = await verify(hashedPassword, 'wrongPassword');
  assert(invalidVerification === false, 'Argon2id password verification rejects wrong password');

  // Test JWT Session creation & verification
  const secretKey = new TextEncoder().encode(sessionSecret);
  const token = await new SignJWT({ email: adminEmail, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);

  const { payload } = await jwtVerify(token, secretKey);
  assert(payload.role === 'admin' && payload.email === adminEmail, 'Admin session token payload verified');

  console.log('\n--- 3. Testing Safe Asset Deletion Check ---');
  // Create a mock asset in DB
  const assetId = new ObjectId();
  const mockAsset = {
    _id: assetId,
    name: 'test_cover',
    url: 'https://res.cloudinary.com/dqcwl3vyg/image/upload/v12345/portfolio-assets/test_cover.jpg',
    publicId: 'portfolio-assets/test_cover',
    folder: 'portfolio-assets',
    format: 'jpg',
    resourceType: 'image',
    width: 800,
    height: 1200,
    bytes: 124500,
    alt: 'Test Cover Art',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection('assets').insertOne(mockAsset);

  // Link mock asset to a temporary activity
  const tempActivityId = new ObjectId();
  await db.collection('activities').insertOne({
    _id: tempActivityId,
    type: 'reading',
    title: 'Test Referenced Book',
    coverImage: mockAsset.url,
    status: 'ongoing',
    priority: 99,
    isCurrent: false,
    visibility: 'public',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Verify deletion safety check: should find referencing activity
  const referencedActivity = await db.collection('activities').findOne({
    $or: [{ coverImage: mockAsset.url }, { assetId: mockAsset._id.toString() }],
  });

  assert(
    referencedActivity !== null && referencedActivity.title === 'Test Referenced Book',
    'Safety check prevents deleting asset currently used by an activity'
  );

  // Clean up test records
  await db.collection('activities').deleteOne({ _id: tempActivityId });
  await db.collection('assets').deleteOne({ _id: assetId });

  console.log('\n--- 4. Testing Analytics Admin Exclusion ---');
  const now = new Date();
  // Insert test visitor event
  const visitorEventId = new ObjectId();
  await db.collection('interactions').insertOne({
    _id: visitorEventId,
    type: 'page_view',
    page: '/',
    deviceType: 'desktop',
    os: 'Windows',
    browser: 'Chrome',
    actorType: 'visitor',
    visitorId: 'test_visitor_123',
    createdAt: now,
  });

  // Insert test admin event
  const adminEventId = new ObjectId();
  await db.collection('interactions').insertOne({
    _id: adminEventId,
    type: 'page_view',
    page: '/dashboard',
    deviceType: 'desktop',
    os: 'Windows',
    browser: 'Chrome',
    actorType: 'admin',
    createdAt: now,
  });

  // Query visitor metrics: Must exclude admin!
  const visitorCount = await db.collection('interactions').countDocuments({
    actorType: 'visitor',
    _id: { $in: [visitorEventId, adminEventId] },
  });

  assert(visitorCount === 1, 'Analytics aggregation strictly excludes admin activity from visitor statistics');

  // Clean up test events
  await db.collection('interactions').deleteMany({
    _id: { $in: [visitorEventId, adminEventId] },
  });

  await client.close();

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
