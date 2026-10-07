'use client';

import React from 'react';
import { GraduationCap, Award, School } from 'lucide-react';
import { EDUCATION } from '@/data/education';
import { IEducation } from '@/types/portfolio';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Education() {
  const getEducationIcon = (item: IEducation) => {
    switch (item.education.toLowerCase()) {
      case 'btech':
        return <GraduationCap className="w-5 h-5 text-accent" />;
      case 'diploma':
        return <Award className="w-5 h-5 text-accent" />;
      case 'matriculation':
        return <School className="w-5 h-5 text-accent" />;
      default:
        return <GraduationCap className="w-5 h-5 text-accent" />;
    }
  };

  return (
    <section id="education" className="pt-16 sm:pt-20 pb-16 sm:pb-24 border-t border-border">
      <Reveal>
        <div className="mb-10">
          <SectionHeading title="Education." />
        </div>

        <div className="max-w-3xl space-y-8">
          {EDUCATION.map((item) => (
            <div key={`${item.education}-${item.startDate}`} className="flex items-start gap-4 sm:gap-5 group">
              <div className="p-2 sm:p-2.5 rounded-lg border border-border bg-surface text-foreground shrink-0 mt-0.5 group-hover:border-accent transition-colors">
                {getEducationIcon(item)}
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-semibold text-foreground text-base sm:text-lg">
                      {item.education}
                    </h3>
                    {item.course && (
                      <>
                        <span className="text-foreground-muted text-xs" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-foreground-secondary text-sm font-normal">
                          {item.course}
                        </span>
                      </>
                    )}
                  </div>
                  <span className="font-mono text-xs text-foreground-muted shrink-0">
                    {item.startDate} – {item.endDate}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-foreground-secondary">
                  <span>{item.graduatedFrom}</span>
                  {item.grade && (
                    <>
                      <span className="text-foreground-muted">·</span>
                      <span className="text-accent font-medium">Grade: {item.grade}</span>
                    </>
                  )}
                </div>

                {item.description && (
                  <p className="text-sm text-foreground-secondary font-light pt-1 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
