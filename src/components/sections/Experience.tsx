'use client';

import React from 'react';
import { experienceData } from '@/data/experience';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ExperienceItem } from '@/components/ui/ExperienceItem';

export function Experience() {
  return (
    <section id="experience" className="pt-16 sm:pt-20 pb-16 sm:pb-24 border-t border-border">
      <Reveal>
        <div className="mb-12">
          <SectionHeading number="04" label="EXPERIENCE" title="Work I've done." />
        </div>

        <div className="max-w-3xl">
          {experienceData.map((item, index) => (
            <ExperienceItem
              key={item.id}
              item={item}
              isLast={index === experienceData.length - 1}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
