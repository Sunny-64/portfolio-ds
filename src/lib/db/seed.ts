import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB_NAME || 'portfolio';

export async function seedDatabase() {
  if (!uri) {
    console.warn('MONGODB_URI is not set. Skipping database seed.');
    return;
  }
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas...');
    const db = client.db(dbName);
    const activitiesCollection = db.collection('activities');

    // Check if activities already seeded
    const count = await activitiesCollection.countDocuments();
    if (count > 0) {
      console.log(`Database already has ${count} activities. Skipping duplicate seed.`);
      return;
    }

    console.log('Seeding initial activities...');

    const initialActivities = [
      // 1. Learning: Excel (Priority 1)
      {
        type: 'learning',
        title: 'Excel',
        description: 'Advanced formulas, pivot tables, data modeling, Power Query',
        coverImage: '',
        startDate: '2024-01-01',
        endDate: null,
        status: 'ongoing',
        priority: 1,
        isFeatured: true,
        isCurrent: true,
        visibility: 'public',
        metadata: {
          platform: 'Advanced Practice & Newton School',
          topics: [
            { title: 'Pivot Tables & Slicers', completed: true },
            { title: 'XLOOKUP & Dynamic Arrays', completed: true },
            { title: 'Power Query & Automation', completed: true },
            { title: 'Business & Financial Modeling', completed: false },
          ],
          progress: 85,
          notes: 'Primary focus — mastering data modeling and complex analysis.',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // 2. Learning: SQL (Priority 2)
      {
        type: 'learning',
        title: 'SQL',
        description: 'Complex queries, window functions, CTEs, performance tuning',
        coverImage: '',
        startDate: '2024-02-01',
        endDate: null,
        status: 'ongoing',
        priority: 2,
        isFeatured: true,
        isCurrent: true,
        visibility: 'public',
        metadata: {
          platform: 'DataCamp & LeetCode SQL 50',
          topics: [
            { title: 'Window Functions (RANK, DENSE_RANK, OVER)', completed: true },
            { title: 'Common Table Expressions (CTEs)', completed: true },
            { title: 'Multi-table JOINS & Aggregations', completed: true },
            { title: 'Query Indexing & Performance', completed: false },
          ],
          progress: 75,
          notes: 'Secondary focus — query writing and database performance.',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // 3. Learning: Python (Priority 3)
      {
        type: 'learning',
        title: 'Python',
        description: 'Pandas, NumPy, data cleaning, exploratory data analysis',
        coverImage: '',
        startDate: '2024-03-01',
        endDate: null,
        status: 'ongoing',
        priority: 3,
        isFeatured: true,
        isCurrent: true,
        visibility: 'public',
        metadata: {
          platform: 'Python for Data Science',
          topics: [
            { title: 'Pandas DataFrames & Manipulation', completed: true },
            { title: 'NumPy Vectorized Operations', completed: true },
            { title: 'Data Cleaning & Missing Value Imputation', completed: true },
            { title: 'Statistical Analysis & EDA', completed: false },
          ],
          progress: 65,
          notes: 'Secondary focus — scripting and data analysis pipelines.',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // 4. Gaming: NieR:Automata (Current)
      {
        type: 'gaming',
        title: 'NieR:Automata',
        description: 'Game of the YoRHa Edition',
        coverImage: '/images/now/nier-automata.jpg',
        startDate: null,
        endDate: null,
        status: 'ongoing',
        priority: 1,
        isFeatured: true,
        isCurrent: true,
        visibility: 'public',
        metadata: {
          platform: 'PC / Steam',
          notes: 'Currently playing NieR:Automata Game of the YoRHa Edition.',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // 5. Reading: Short Stories Collection by Roald Dahl (Current)
      {
        type: 'reading',
        title: 'Short Stories Collection',
        description: 'by Roald Dahl',
        coverImage: '/images/now/roald-dahl.jpg',
        startDate: null,
        endDate: null,
        status: 'ongoing',
        priority: 1,
        isFeatured: true,
        isCurrent: true,
        visibility: 'public',
        metadata: {
          author: 'Roald Dahl',
          rating: 5,
          notes: 'Classic collection of stories by Roald Dahl.',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // 6. Historical Projects (Completed, isCurrent: false - NO active projects)
      {
        type: 'project',
        title: 'Online Journal',
        description: 'Interactive web application with markdown note taking and analytics.',
        coverImage: '/images/projects/online-journal.png',
        startDate: '2023-01-01',
        endDate: '2023-06-01',
        status: 'completed',
        priority: 1,
        isFeatured: true,
        isCurrent: false, // NOT current!
        visibility: 'public',
        metadata: {
          technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
          githubUrl: 'https://github.com',
          liveDemoUrl: 'https://example.com',
          keyContributions: ['Full-stack architecture', 'Responsive UI', 'Rich-text editing'],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'project',
        title: 'NFT Marketplace',
        description: 'Decentralized digital marketplace exploring Web3 and interactive frontend patterns.',
        coverImage: '/images/projects/nft-marketplace.png',
        startDate: '2023-07-01',
        endDate: '2023-11-01',
        status: 'completed',
        priority: 2,
        isFeatured: false,
        isCurrent: false, // NOT current!
        visibility: 'public',
        metadata: {
          technologies: ['Next.js', 'TypeScript', 'Ethers.js', 'Tailwind CSS'],
          githubUrl: 'https://github.com',
          liveDemoUrl: 'https://example.com',
          keyContributions: ['Smart contract integration', 'Responsive catalog'],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await activitiesCollection.insertMany(initialActivities);
    console.log(`Successfully seeded ${initialActivities.length} activities into MongoDB!`);
  } catch (err) {
    console.error('Database seed error:', err);
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}
