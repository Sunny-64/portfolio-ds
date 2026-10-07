'use client';

import React from 'react';
import { GraduationCap, FileText, School } from 'lucide-react';
import { EDUCATION } from '@/data/education';
import { IEducation } from '@/types/portfolio';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Education() {
  const getEducationIcon = (item: IEducation) => {
    switch (item.education.toLowerCase()) {
      case 'btech':
        return <GraduationCap className="w-6 h-6 text-accent" />;
      case 'diploma':
        return <FileText className="w-6 h-6 text-accent" />;
      case 'matriculation':
        return <School className="w-6 h-6 text-accent" />;
      default:
        return <GraduationCap className="w-6 h-6 text-accent" />;
    }
  };

  return (
    <section id="education" className="pt-16 sm:pt-20 pb-16 sm:pb-24 border-t border-border">
      <Reveal>
        <div className="mb-10 sm:mb-12">
          <SectionHeading
            title="Education."
            label="MY ACADEMIC BACKGROUND"
            description="My formal education that shaped my foundation in technology."
          />
        </div>

        {/* Outer timeline container with subtle top horizontal line and connector nodes */}
        <div className="relative pt-6">
          {/* Subtle horizontal timeline track running across the top of cards */}
          <div
            className="hidden md:block absolute top-0 left-0 right-0 h-[1px] bg-border/60"
            aria-hidden="true"
          />

          {/* 3 Horizontal Cards Layout with timeline connectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {EDUCATION.map((item, index) => {
              const isFirst = index === 0;

              return (
                <div key={`${item.education}-${item.startDate}`} className="relative">
                  {/* Top connector stem + timeline node dot */}
                  <div
                    className="hidden md:flex absolute -top-6 left-0 items-center -translate-y-1/2 z-10"
                    aria-hidden="true"
                  >
                    {/* Node dot with subtle blue ring for active/first, or muted for past */}
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        isFirst
                          ? 'bg-accent shadow-[0_0_0_3px_var(--background),0_0_0_4px_var(--accent)]'
                          : 'bg-accent/80 shadow-[0_0_0_3px_var(--background)]'
                      }`}
                    />
                  </div>

                  {/* Left vertical timeline line segment */}
                  <div
                    className="hidden md:block absolute top-0 -left-px bottom-0 w-[1px] bg-border/60"
                    aria-hidden="true"
                  />

                  {/* Card Container */}
                  <div className="group h-full p-6 sm:p-7 rounded-xl border border-border/80 bg-surface/50 hover:bg-surface/80 hover:border-accent/40 transition-all duration-200 flex flex-col justify-between">
                    <div className="flex items-start gap-4 sm:gap-5">
                      {/* Left Icon */}
                      <div className="shrink-0 mt-0.5 text-accent transition-transform duration-200 group-hover:scale-110">
                        {getEducationIcon(item)}
                      </div>

                      {/* Right Details */}
                      <div className="flex-1 space-y-1.5 min-w-0">
                        {/* Title & Year Range */}
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="font-semibold text-foreground text-base sm:text-lg tracking-tight">
                            {item.education}
                          </h3>
                          <span className="font-mono text-xs text-foreground-muted shrink-0">
                            {item.startDate} — {item.endDate}
                          </span>
                        </div>

                        {/* Course Name */}
                        {item.course && (
                          <div className="text-xs sm:text-sm text-accent font-normal leading-relaxed">
                            {item.course}
                          </div>
                        )}

                        {/* Institution */}
                        <div className="font-mono text-[11px] sm:text-xs text-foreground-secondary/90 leading-relaxed pt-0.5">
                          {item.graduatedFrom}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
