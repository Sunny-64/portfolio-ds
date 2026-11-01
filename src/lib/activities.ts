import { getActivitiesCollection, getSectionCardsCollection } from './mongodb';
import {
  ActivityDocument,
  ActivityType,
  SectionCardDocument,
} from '@/types/cms';
import { getDefaultSectionCards } from './cms-cards';

export { getDefaultSectionCards };

/**
 * Server-side helper to fetch current activities for the homepage "What I'm Upto" section.
 * Returns public, isCurrent=true activities sorted by priority.
 */
export async function getCurrentActivities(): Promise<ActivityDocument[]> {
  try {
    const collection = await getActivitiesCollection();
    if (!collection) return [];

    const activities = await collection
      .find({
        isCurrent: true,
        visibility: { $ne: 'private' },
      })
      .sort({ priority: 1, createdAt: -1 })
      .toArray();

    return activities.map((item) => ({
      ...item,
      _id: item._id?.toString(),
    }));
  } catch (err) {
    console.error('Error fetching current activities:', err);
    return [];
  }
}

/**
 * Server-side helper to fetch historical/all activities by type.
 */
export async function getActivitiesByType(type: string): Promise<ActivityDocument[]> {
  try {
    const collection = await getActivitiesCollection();
    if (!collection) return [];

    const activities = await collection
      .find({
        type: type as ActivityType,
        visibility: { $ne: 'private' },
      })
      .sort({ isCurrent: -1, priority: 1, createdAt: -1 })
      .toArray();

    return activities.map((item) => ({
      ...item,
      _id: item._id?.toString(),
    }));
  } catch (err) {
    console.error(`Error fetching activities for type ${type}:`, err);
    return [];
  }
}

/**
 * Fetches the 4 standardized homepage cards.
 * Combines saved customizations from MongoDB 'section_cards' with default values.
 */
export async function getSectionCards(): Promise<SectionCardDocument[]> {
  try {
    const cardsCollection = await getSectionCardsCollection();
    const currentActivities = await getCurrentActivities();
    const defaults = getDefaultSectionCards(currentActivities);

    if (!cardsCollection) {
      return defaults;
    }

    const savedCards = await cardsCollection.find({}).sort({ order: 1 }).toArray();

    if (!savedCards || savedCards.length === 0) {
      try {
        await cardsCollection.insertMany(defaults.map((c) => ({ ...c, updatedAt: new Date() })));
      } catch {
        // ignore unique key race if already initialized
      }
      return defaults;
    }

    const merged = defaults.map((def) => {
      const found = savedCards.find((s) => s.category === def.category);
      if (!found) return def;
      return {
        ...def,
        ...found,
        _id: found._id?.toString(),
      };
    });

    return merged.sort((a, b) => a.order - b.order);
  } catch (err) {
    console.error('Error in getSectionCards:', err);
    return getDefaultSectionCards();
  }
}

/**
 * Updates or upserts a section card customization in MongoDB 'section_cards'.
 */
export async function updateSectionCard(
  category: string,
  updates: Partial<SectionCardDocument>
): Promise<SectionCardDocument | null> {
  const collection = await getSectionCardsCollection();
  if (!collection) return null;

  const validCategories: Array<'project' | 'learning' | 'reading' | 'gaming'> = [
    'project',
    'learning',
    'reading',
    'gaming',
  ];
  if (!validCategories.includes(category as 'project' | 'learning' | 'reading' | 'gaming')) {
    return null;
  }

  const allowedUpdates: Partial<SectionCardDocument> = {
    updatedAt: new Date(),
  };

  if (typeof updates.title === 'string' && updates.title.trim()) {
    allowedUpdates.title = updates.title.trim();
  }
  if (typeof updates.subtitle === 'string') {
    allowedUpdates.subtitle = updates.subtitle.trim();
  }
  if (typeof updates.description === 'string') {
    allowedUpdates.description = updates.description.trim();
  }
  if (typeof updates.coverImage === 'string' && updates.coverImage.trim()) {
    allowedUpdates.coverImage = updates.coverImage.trim();
  }
  if (typeof updates.iconName === 'string' && updates.iconName.trim()) {
    allowedUpdates.iconName = updates.iconName.trim();
  }
  if (typeof updates.order === 'number') {
    allowedUpdates.order = updates.order;
  }
  if (typeof updates.isEnabled === 'boolean') {
    allowedUpdates.isEnabled = updates.isEnabled;
  }
  if (typeof updates.linkHref === 'string') {
    allowedUpdates.linkHref = updates.linkHref.trim();
  }

  await collection.updateOne(
    { category: category as 'project' | 'learning' | 'reading' | 'gaming' },
    {
      $set: allowedUpdates,
      $setOnInsert: { category: category as 'project' | 'learning' | 'reading' | 'gaming' },
    },
    { upsert: true }
  );

  const updated = await collection.findOne({
    category: category as 'project' | 'learning' | 'reading' | 'gaming',
  });
  if (!updated) return null;

  return {
    ...updated,
    _id: updated._id?.toString(),
  };
}
