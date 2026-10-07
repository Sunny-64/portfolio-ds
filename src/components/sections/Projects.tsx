'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { PROJECTS } from '@/data/projects';
import { ProjectCategory } from '@/types/portfolio';
import {
  getAvailableProjectCategories,
  filterProjectsByCategory,
} from '@/lib/projects';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function Projects() {
  const [activeCategory, setActiveCategory] = useState<'all' | ProjectCategory>('all');

  // Derive categories dynamically from PROJECTS data
  const categoryOptions = useMemo(() => {
    return getAvailableProjectCategories(PROJECTS);
  }, []);

  // Filter projects dynamically
  const displayedProjects = useMemo(() => {
    return filterProjectsByCategory(PROJECTS, activeCategory);
  }, [activeCategory]);

  return (
    <section id="projects" className="pt-16 sm:pt-20 pb-16 sm:pb-24 border-t border-border">
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <SectionHeading title="Selected Work." />

          {/* Dynamic Category Controls: Only render when more than 1 category has projects */}
          {categoryOptions.length > 0 && (
            <div
              className="flex items-center gap-1.5 p-1 bg-surface border border-border rounded-lg self-start sm:self-end"
              role="tablist"
              aria-label="Filter projects by category"
            >
              {categoryOptions.map((opt) => {
                const isSelected = activeCategory === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveCategory(opt.key)}
                    className={`px-3 py-1 text-xs font-mono tracking-wider uppercase transition-colors rounded-md ${
                      isSelected
                        ? 'bg-accent text-white font-medium shadow-xs'
                        : 'text-foreground-secondary hover:text-foreground'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Projects Grid: 3 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedProjects.map((project) => (
            <div
              key={project.name}
              className="group flex flex-col justify-between space-y-3 p-4 rounded-lg border border-border bg-surface/40 hover:bg-surface hover:border-accent/40 transition-all duration-200"
            >
              <div className="space-y-3">
                {/* Thumbnail Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-border bg-surface">
                  <Image
                    src={project.imageUrl}
                    alt={project.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-103"
                  />
                </div>

                {/* Title & External Link */}
                <div className="flex items-center justify-between pt-1">
                  <h3 className="font-semibold text-foreground text-base group-hover:text-accent transition-colors duration-200">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {project.github && (
                      <Link
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View source code of ${project.name} on GitHub`}
                        className="text-foreground-muted hover:text-foreground p-1 transition-colors"
                      >
                        <GitHubIcon className="w-4 h-4" />
                      </Link>
                    )}
                    {project.url && (
                      <Link
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit live demo for ${project.name}`}
                        className="text-foreground-muted hover:text-accent p-1 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-foreground-secondary text-xs sm:text-sm font-light leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Technologies */}
              <div className="pt-2 border-t border-border/50">
                <p className="font-mono text-[11px] text-foreground-muted">
                  {project.techStack}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
