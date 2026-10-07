'use client';

import React from 'react';
import { skillsData } from '@/data/skills';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SkillIcon } from '@/components/ui/SkillIcon';

export function Skills() {
  return (
    <section id="skills" className="pt-16 sm:pt-20 pb-16 sm:pb-24 border-t border-border">
      <Reveal>
        <div className="mb-10">
          <SectionHeading title="Tools I work with." />
        </div>

        {/* Skills container with editorial column dividers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 border border-border bg-surface/50 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-border">
          {skillsData.map((skill) => (
            <div
              key={skill.id}
              className="group p-6 flex flex-col items-center justify-center text-center gap-4 transition-all duration-200 hover:-translate-y-1 hover:bg-surface"
            >
              <div className="transition-transform duration-200 group-hover:scale-110">
                <SkillIcon name={skill.iconName} className="w-8 h-8" />
              </div>
              <span className="font-mono text-xs text-foreground-secondary font-medium tracking-tight group-hover:text-foreground transition-colors">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
