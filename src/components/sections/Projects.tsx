'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { projectsData } from '@/data/projects';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Projects() {
  return (
    <section id="projects" className="pt-16 sm:pt-20 pb-16 sm:pb-24 border-t border-border">
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <SectionHeading number="05" label="PROJECTS" title="Selected Work." />
          <Link
            href="#projects"
            className="group inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:text-accent-hover transition-colors font-medium self-start sm:self-end pb-1"
          >
            <span>View all</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* 3 columns project grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {projectsData.map((project) => (
            <Link
              key={project.id}
              href={project.href}
              className="group block space-y-3 cursor-pointer"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-border bg-surface transition-colors duration-200 group-hover:border-accent/40">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 320px"
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-103"
                />
              </div>

              {/* Title & Arrow */}
              <div className="flex items-center justify-between pt-1">
                <h3 className="font-semibold text-foreground text-base group-hover:text-accent transition-colors duration-200">
                  {project.title}
                </h3>
                <span className="text-foreground-muted text-sm transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent">
                  →
                </span>
              </div>

              {/* Technologies */}
              <p className="font-mono text-xs text-foreground-secondary">
                {project.technologies.join('  ·  ')}
              </p>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
