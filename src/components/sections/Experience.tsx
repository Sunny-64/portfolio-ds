'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { EXPERIENCE } from '@/data/experience';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ExperienceItem } from '@/components/ui/ExperienceItem';

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);

  // Motion scroll-linked tracking on the Experience container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 50%'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    // Determine which item is currently reached
    const total = EXPERIENCE.length;
    if (total === 0) return;

    // Threshold boundaries for activation
    const calculatedIndex = Math.min(
      total - 1,
      Math.max(0, Math.floor(latest * total * 1.1))
    );
    setActiveItemIndex(calculatedIndex);
  });

  return (
    <section id="experience" className="pt-16 sm:pt-20 pb-16 sm:pb-24 border-t border-border">
      <Reveal>
        <div className="mb-10 sm:mb-12">
          <SectionHeading
            title="Work I've Done."
            label="PROFESSIONAL EXPERIENCE"
            description="A timeline of my professional journey so far, with the companies I've worked with."
          />
        </div>

        {/* Experience timeline wrapper */}
        <div ref={containerRef} className="relative max-w-3xl">
          {/* Animated Overlay Progress Line (ScaleY from top) */}
          <div
            className="absolute left-[7px] sm:left-[9px] top-3 bottom-10 w-[2px] pointer-events-none z-10"
            aria-hidden="true"
          >
            <motion.div
              style={{
                scaleY: scrollYProgress,
                transformOrigin: 'top',
              }}
              className="w-full h-full bg-accent rounded-full will-change-transform motion-reduce:hidden"
            />
          </div>

          {EXPERIENCE.map((item, index) => (
            <ExperienceItem
              key={item.id}
              item={item}
              isActive={index <= activeItemIndex}
              isLast={index === EXPERIENCE.length - 1}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
