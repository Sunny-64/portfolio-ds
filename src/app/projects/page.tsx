import React from 'react';
import type { Metadata } from 'next';
import { ProjectsView } from '@/components/projects/ProjectsView';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Selected data analytics and software development projects by B Sunny, featuring real-world applications, tools, and technical problem solving.',
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: 'Projects — B Sunny',
    description:
      'Selected data analytics and software development projects by B Sunny, featuring real-world applications, tools, and technical problem solving.',
    url: '/projects',
    type: 'website',
  },
};

export default function ProjectsPage() {
  return <ProjectsView />;
}
