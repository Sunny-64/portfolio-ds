import {
  ActivityDocument,
  ReadingMetadata,
  GamingMetadata,
  SectionCardDocument,
} from '@/types/cms';

/**
 * Pure client-safe default standard section cards for the What I'm Upto section.
 * Exactly 4 standardized categories: Working On (Projects), Learning, Reading, Playing.
 * Does NOT import MongoDB or Node.js server modules.
 */
export function getDefaultSectionCards(activities: ActivityDocument[] = []): SectionCardDocument[] {
  const activeProjects = activities.filter((a) => a.type === 'project' && a.isCurrent);
  const currentReading = activities.find((a) => a.type === 'reading' && a.isCurrent);
  const currentGaming = activities.find((a) => a.type === 'gaming' && a.isCurrent);

  const activeProject = activeProjects.length > 0 ? activeProjects[0] : null;

  return [
    {
      category: 'project',
      title: 'Working On',
      subtitle: activeProject ? activeProject.title : 'Standby Mode',
      description: activeProject
        ? activeProject.description || 'Active project'
        : 'Nothing in progress right now.',
      coverImage: activeProject?.coverImage || '/images/now/working-on-empty.svg',
      iconName: 'Laptop',
      order: 1,
      isEnabled: true,
      linkHref: '/projects',
    },
    {
      category: 'learning',
      title: 'Learning',
      subtitle: 'Data Science & Analytics',
      description: 'Currently focusing on Excel, SQL and Python.',
      coverImage: '/images/now/learning.svg',
      iconName: 'BookOpen',
      order: 2,
      isEnabled: true,
      linkHref: '/learning',
    },
    {
      category: 'reading',
      title: 'Reading',
      subtitle: currentReading ? currentReading.title : 'Short Stories Collection',
      description:
        currentReading?.description ||
        ((currentReading?.metadata as ReadingMetadata)?.author
          ? `by ${(currentReading?.metadata as ReadingMetadata)?.author}`
          : 'by Roald Dahl'),
      coverImage: currentReading?.coverImage || '/images/now/roald-dahl.jpg',
      iconName: 'BookText',
      order: 3,
      isEnabled: true,
      linkHref: '/reading',
    },
    {
      category: 'gaming',
      title: 'Playing',
      subtitle: currentGaming ? currentGaming.title : 'NieR:Automata',
      description:
        currentGaming?.description ||
        ((currentGaming?.metadata as GamingMetadata)?.platform || 'Game of the YoRHa Edition'),
      coverImage: currentGaming?.coverImage || '/images/now/nier-automata.jpg',
      iconName: 'Gamepad2',
      order: 4,
      isEnabled: true,
      linkHref: '/gaming',
    },
  ];
}
