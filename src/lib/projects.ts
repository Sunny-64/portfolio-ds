import { IProject, ProjectCategory } from '@/types/portfolio';

export interface CategoryOption {
  key: 'all' | ProjectCategory;
  label: string;
  count: number;
}

/**
 * Inspects the provided list of projects and derives the list of active categories.
 * If projects belong to more than 1 distinct category, returns categories along with 'all'.
 * If all projects belong to only 1 category (or none), returns an empty array to signal
 * that category filtering controls should be hidden.
 */
export function getAvailableProjectCategories(projects: IProject[]): CategoryOption[] {
  const categoryCounts = new Map<ProjectCategory, number>();

  for (const project of projects) {
    if (project.category) {
      const current = categoryCounts.get(project.category) || 0;
      categoryCounts.set(project.category, current + 1);
    }
  }

  const distinctCategories = Array.from(categoryCounts.keys()).filter(
    (cat) => (categoryCounts.get(cat) || 0) > 0
  );

  // If only 1 category contains projects (or none), do not show category filter buttons
  if (distinctCategories.length <= 1) {
    return [];
  }

  const formatCategoryLabel = (cat: ProjectCategory): string => {
    switch (cat) {
      case 'web-development':
        return 'Web Development';
      case 'data-analytics':
        return 'Data Analytics';
      default:
        return cat;
    }
  };

  const options: CategoryOption[] = [
    {
      key: 'all',
      label: 'All',
      count: projects.length,
    },
  ];

  for (const cat of distinctCategories) {
    options.push({
      key: cat,
      label: formatCategoryLabel(cat),
      count: categoryCounts.get(cat) || 0,
    });
  }

  return options;
}

/**
 * Filters the project list by the selected category.
 */
export function filterProjectsByCategory(
  projects: IProject[],
  activeCategory: 'all' | ProjectCategory
): IProject[] {
  if (activeCategory === 'all') {
    return projects;
  }
  return projects.filter((project) => project.category === activeCategory);
}
