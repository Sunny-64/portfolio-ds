import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle2, Circle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { connection } from 'next/server';
import { getActivitiesByType } from '@/lib/activities';
import { LearningMetadata, LearningTopic } from '@/types/cms';

export const instant = false;

export const metadata: Metadata = {
  title: 'Learning & Curriculum — B Sunny',
  description: 'Ongoing and historical learning journey in Data Science, Analytics, and Software Engineering.',
};

export default async function LearningPage() {
  await connection();
  const learningItems = await getActivitiesByType('learning');

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground-secondary hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
          </Link>
        </div>

        <SectionHeading
          title="Learning Journey"
          label="CURRICULUM & SKILLS"
          description="A detailed view of what I am actively learning, topics mastered, and ongoing milestones in Data Analytics and Engineering."
        />

        <div className="mt-12 space-y-8">
          {learningItems.map((item, index) => {
            const meta = (item.metadata || {}) as LearningMetadata;
            const topics = (meta.topics || []) as LearningTopic[];

            return (
              <div
                key={item._id?.toString() || item.title}
                className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-surface/50 transition-all duration-200 space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-accent font-semibold">
                          #{item.priority || index + 1}
                        </span>
                        <h2 className="text-xl font-bold text-foreground tracking-tight">
                          {item.title}
                        </h2>
                        {item.isCurrent && (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-accent/15 text-accent font-medium">
                            Active
                          </span>
                        )}
                      </div>
                      {meta.platform && (
                        <p className="text-xs text-foreground-muted font-mono mt-0.5">
                          {meta.platform}
                        </p>
                      )}
                    </div>
                  </div>

                  {typeof meta.progress === 'number' && (
                    <div className="sm:text-right">
                      <div className="text-xs font-mono text-foreground-secondary">
                        Progress: <span className="text-accent font-semibold">{meta.progress}%</span>
                      </div>
                      <div className="w-32 h-1.5 bg-surface-elevated rounded-full overflow-hidden mt-1.5 border border-border">
                        <div
                          className="h-full bg-accent rounded-full transition-all duration-500"
                          style={{ width: `${meta.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {item.description && (
                  <p className="text-sm text-foreground-secondary font-light leading-relaxed">
                    {item.description}
                  </p>
                )}

                {topics.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-border/60">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-foreground-muted">
                      Topics Covered
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {topics.map((topic, tIdx) => (
                        <div
                          key={tIdx}
                          className="flex items-center gap-2 text-xs text-foreground-secondary bg-surface-elevated/40 px-3 py-2 rounded-lg border border-border/40"
                        >
                          {topic.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-foreground-muted/60 shrink-0" />
                          )}
                          <span className={topic.completed ? 'text-foreground font-medium' : 'text-foreground-muted'}>
                            {topic.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {meta.notes && (
                  <div className="text-xs text-foreground-muted/90 bg-accent-soft/20 p-3.5 rounded-xl border border-accent/15 font-light leading-relaxed">
                    <span className="font-medium text-foreground">Notes:</span> {meta.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
