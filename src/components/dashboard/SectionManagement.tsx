'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  ImageIcon,
  Layers,
  BookOpen,
  Laptop,
  BookText,
  Gamepad2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Sliders,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import {
  ActivityDocument,
  ActivityType,
  LearningMetadata,
  ReadingMetadata,
  GamingMetadata,
  ProjectMetadata,
  SectionCardDocument,
} from '@/types/cms';
import { ActivityModal } from './ActivityModal';
import { AssetManagerModal } from './AssetManagerModal';
import { ActivityPreview } from './ActivityPreview';
import { SectionCardModal } from './SectionCardModal';

export function SectionManagement() {
  const [activeView, setActiveView] = useState<'homepage-cards' | 'activity-records'>('homepage-cards');
  const [sectionCards, setSectionCards] = useState<SectionCardDocument[]>([]);
  const [activities, setActivities] = useState<ActivityDocument[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<ActivityDocument | null>(null);
  const [defaultCategoryForNew, setDefaultCategoryForNew] = useState<ActivityType>('learning');
  const [isAssetManagerOpen, setIsAssetManagerOpen] = useState(false);
  const [previewingActivity, setPreviewingActivity] = useState<ActivityDocument | null>(null);

  // Section Card Modal state
  const [cardToEdit, setCardToEdit] = useState<SectionCardDocument | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  // Fetch all CMS data
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [actRes, cardsRes] = await Promise.all([
        fetch('/api/dashboard/activities'),
        fetch('/api/dashboard/section-cards'),
      ]);

      if (!actRes.ok) throw new Error('Failed to load activities');
      const actData = await actRes.json();
      setActivities(actData.activities || []);

      if (cardsRes.ok) {
        const cardsData = await cardsRes.json();
        setSectionCards(cardsData.cards || []);
      }
    } catch {
      setError('Unable to fetch data from MongoDB.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      fetch('/api/dashboard/activities').then((r) => r.json()),
      fetch('/api/dashboard/section-cards').then((r) => r.json()),
    ])
      .then(([actData, cardsData]) => {
        if (isMounted) {
          setActivities(actData.activities || []);
          setSectionCards(cardsData.cards || []);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Unable to fetch data from MongoDB.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Lock body scroll when modal preview is active
  useEffect(() => {
    if (previewingActivity) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [previewingActivity]);

  // Filter activities
  const filteredActivities = activities.filter((a) => {
    if (selectedCategory === 'all') return true;
    return a.type === selectedCategory;
  });

  // Delete activity handler
  const handleDeleteActivity = async (activity: ActivityDocument) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${activity.title}" (${activity.type})?`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/dashboard/activities/${activity._id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to delete activity');
        return;
      }
      setActivities((prev) => prev.filter((a) => a._id !== activity._id));
    } catch {
      alert('Network error while deleting activity');
    }
  };

  const getCategoryIcon = (key: string) => {
    const iconKey = key.toLowerCase();
    switch (iconKey) {
      case 'learning':
      case 'bookopen':
      case 'book-open':
        return <BookOpen className="w-4 h-4 text-accent" />;
      case 'project':
      case 'laptop':
        return <Laptop className="w-4 h-4 text-accent" />;
      case 'reading':
      case 'booktext':
      case 'book-text':
        return <BookText className="w-4 h-4 text-accent" />;
      case 'gaming':
      case 'gamepad2':
      case 'gamepad':
        return <Gamepad2 className="w-4 h-4 text-accent" />;
      default:
        return <Layers className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Section Management</h2>
          <p className="text-xs text-foreground-secondary font-mono">
            Manage the standardized &quot;What I&apos;m Upto&quot; cards and detailed activity records
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAssetManagerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-elevated border border-border text-foreground hover:border-accent text-xs font-medium transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-accent" />
            <span>Media Library</span>
          </button>

          <button
            onClick={() => {
              setActivityToEdit(null);
              setDefaultCategoryForNew(
                selectedCategory !== 'all' ? (selectedCategory as ActivityType) : 'learning'
              );
              setIsActivityModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-all shadow-md shadow-accent/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
          <button onClick={fetchData} className="text-xs underline">
            Retry
          </button>
        </div>
      )}

      {/* Main Mode Toggle: Homepage Cards vs Detailed Activity Records */}
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('homepage-cards')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
              activeView === 'homepage-cards'
                ? 'bg-accent text-white font-semibold shadow-md shadow-accent/20'
                : 'bg-surface-elevated text-foreground-secondary hover:text-foreground border border-border'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Homepage Section Cards ({sectionCards.length || 4})</span>
          </button>

          <button
            onClick={() => setActiveView('activity-records')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
              activeView === 'activity-records'
                ? 'bg-accent text-white font-semibold shadow-md shadow-accent/20'
                : 'bg-surface-elevated text-foreground-secondary hover:text-foreground border border-border'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Detailed Activity Records ({activities.length})</span>
          </button>
        </div>

        <button
          onClick={fetchData}
          title="Reload data"
          className="p-1 text-foreground-muted hover:text-foreground transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* VIEW 1: Homepage Section Cards (What I'm Upto) */}
      {activeView === 'homepage-cards' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h3 className="text-xs font-mono uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Standardized 4-Card Homepage Layout</span>
              </h3>
              <p className="text-xs text-foreground-muted">
                Every card follows the exact same visual structure: Cover Image (2:3 aspect) + Category Icon + Title + Subtitle + Description.
              </p>
            </div>
            <span className="text-[11px] font-mono text-foreground-muted shrink-0">
              Changes reflect immediately on the homepage
            </span>
          </div>

          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-foreground-muted space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
              <p className="text-xs font-mono">Loading section cards from MongoDB...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {sectionCards.map((card) => (
                <div
                  key={card.category}
                  className="p-4 rounded-xl border border-border/80 bg-surface/60 hover:border-accent/60 transition-all flex flex-col justify-between space-y-3 shadow-sm"
                >
                  {/* Top status & order pill */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2 py-0.5 rounded-md bg-surface-elevated border border-border text-[10px] text-foreground-muted">
                      Order #{card.order}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        card.isEnabled !== false
                          ? 'bg-accent/15 text-accent font-medium'
                          : 'bg-surface-elevated text-foreground-muted'
                      }`}
                    >
                      {card.isEnabled !== false ? 'Live on Homepage' : 'Hidden'}
                    </span>
                  </div>

                  {/* Standardized Card Preview */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-center pb-2.5">
                      {card.coverImage ? (
                        <div className="relative w-[95px] aspect-[2/3] shrink-0 rounded-lg overflow-hidden shadow-sm shadow-black/20 border border-border/50">
                          <Image
                            src={card.coverImage}
                            alt={`${card.title} cover`}
                            fill
                            sizes="95px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-[95px] aspect-[2/3] rounded-lg border border-dashed border-border flex items-center justify-center text-foreground-muted text-[10px] font-mono">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-2 pt-2 border-t border-border/40">
                      <div className="text-accent shrink-0 mt-0.5">
                        {getCategoryIcon(card.iconName || card.category)}
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <h4 className="font-semibold text-foreground text-xs tracking-tight leading-tight truncate">
                          {card.title}
                        </h4>
                        <div className="text-[11px] text-accent font-normal leading-tight truncate">
                          {card.subtitle}
                        </div>
                        <p className="text-[10px] text-foreground-muted font-light leading-tight truncate">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Customize Card Button */}
                  <div className="pt-2 border-t border-border/40">
                    <button
                      onClick={() => {
                        setCardToEdit(card);
                        setIsCardModalOpen(true);
                      }}
                      className="w-full py-1.5 rounded-lg bg-surface-elevated hover:bg-accent/10 border border-border hover:border-accent text-foreground hover:text-accent text-[11px] font-mono transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Customize Card</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: Detailed Activity Records (CMS Data) */}
      {activeView === 'activity-records' && (
        <div className="space-y-6">
          {/* Category Sub-tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border/60">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'learning', label: 'Learning (Subjects)' },
              { id: 'project', label: 'Projects' },
              { id: 'reading', label: 'Reading' },
              { id: 'gaming', label: 'Gaming' },
            ].map((tab) => {
              const count =
                tab.id === 'all'
                  ? activities.length
                  : activities.filter((a) => a.type === tab.id).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                    selectedCategory === tab.id
                      ? 'bg-accent/15 text-accent font-semibold'
                      : 'text-foreground-secondary hover:text-foreground'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-[10px] opacity-75 font-normal">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Activities List */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-foreground-muted space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
              <p className="text-xs font-mono">Loading portfolio activities from MongoDB...</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-2xl space-y-3">
              <Layers className="w-10 h-10 text-foreground-muted mx-auto stroke-1" />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">No activities found in this category</h3>
                <p className="text-xs text-foreground-muted max-w-sm mx-auto">
                  Create an entry to feature what you are currently learning, reading, or working on.
                </p>
              </div>
              <button
                onClick={() => {
                  setActivityToEdit(null);
                  setDefaultCategoryForNew(
                    selectedCategory !== 'all' ? (selectedCategory as ActivityType) : 'learning'
                  );
                  setIsActivityModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent text-white text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5" /> Create Activity
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredActivities.map((activity) => {
                const learningMeta = (activity.type === 'learning' ? activity.metadata : undefined) as
                  | LearningMetadata
                  | undefined;
                const readingMeta = (activity.type === 'reading' ? activity.metadata : undefined) as
                  | ReadingMetadata
                  | undefined;
                const gamingMeta = (activity.type === 'gaming' ? activity.metadata : undefined) as
                  | GamingMetadata
                  | undefined;
                const projectMeta = (activity.type === 'project' ? activity.metadata : undefined) as
                  | ProjectMetadata
                  | undefined;

                return (
                  <div
                    key={activity._id?.toString() || activity.title}
                    className="p-5 rounded-2xl border border-border/80 bg-surface/60 hover:border-accent/50 transition-all flex flex-col justify-between space-y-4 shadow-sm"
                  >
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Category Icon */}
                        <div className="w-9 h-9 rounded-xl bg-surface-elevated border border-border flex items-center justify-center shrink-0 mt-0.5">
                          {getCategoryIcon(activity.type)}
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-surface-elevated border border-border/80 text-accent font-medium">
                              {activity.type}
                            </span>
                            {activity.isCurrent && (
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-accent/15 text-accent font-semibold">
                                Active Item
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-foreground-muted">
                              Priority #{activity.priority}
                            </span>
                          </div>

                          <h3 className="font-bold text-base text-foreground tracking-tight leading-snug truncate">
                            {activity.title}
                          </h3>

                          {activity.description && (
                            <p className="text-xs text-foreground-secondary line-clamp-2 leading-relaxed font-light">
                              {activity.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Thumbnail if present */}
                      {activity.coverImage && (
                        <div className="relative w-14 h-20 shrink-0 rounded-lg overflow-hidden border border-border/60">
                          <Image
                            src={activity.coverImage}
                            alt={activity.title}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Category specific pills */}
                    <div className="text-xs font-mono text-foreground-muted pt-2 border-t border-border/40 flex flex-wrap items-center gap-3">
                      {activity.type === 'learning' && learningMeta && (
                        <>
                          {learningMeta.platform && <span>Platform: {learningMeta.platform}</span>}
                          {learningMeta.topics && (
                            <span className="flex items-center gap-1">
                              <span>Topics:</span>
                              <span className="text-foreground font-medium">
                                {learningMeta.topics.filter((t) => t.completed).length}/
                                {learningMeta.topics.length} done
                              </span>
                            </span>
                          )}
                          {typeof learningMeta.progress === 'number' && (
                            <span className="text-accent font-medium">
                              Progress: {learningMeta.progress}%
                            </span>
                          )}
                        </>
                      )}

                      {activity.type === 'reading' && readingMeta && (
                        <>
                          {readingMeta.author && <span>Author: {readingMeta.author}</span>}
                          {readingMeta.rating && <span>Rating: {readingMeta.rating}/5 ★</span>}
                        </>
                      )}

                      {activity.type === 'gaming' && gamingMeta && (
                        <>{gamingMeta.platform && <span>Platform: {gamingMeta.platform}</span>}</>
                      )}

                      {activity.type === 'project' && projectMeta && (
                        <>
                          <span>Status: {activity.status}</span>
                          {projectMeta.technologies && (
                            <span>Tech: {projectMeta.technologies.slice(0, 3).join(', ')}</span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Topics preview if learning */}
                    {activity.type === 'learning' &&
                      learningMeta?.topics &&
                      learningMeta.topics.length > 0 && (
                        <div className="pt-2 border-t border-border/40">
                          <div className="text-[11px] font-mono text-foreground-muted mb-1.5">
                            Topics:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {learningMeta.topics.slice(0, 5).map((topic, i) => (
                              <span
                                key={i}
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1 ${
                                  topic.completed
                                    ? 'bg-accent/10 text-accent border border-accent/20'
                                    : 'bg-surface-elevated text-foreground-muted border border-border'
                                }`}
                              >
                                {topic.completed ? (
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                ) : (
                                  <Circle className="w-2.5 h-2.5" />
                                )}
                                <span>{topic.title}</span>
                              </span>
                            ))}
                            {learningMeta.topics.length > 5 && (
                              <span className="text-[10px] font-mono text-foreground-muted px-1.5 py-0.5">
                                +{learningMeta.topics.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                    {/* Actions bottom row */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                      <span className="text-[10px] font-mono text-foreground-muted">
                        Updated {new Date(activity.updatedAt || activity.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPreviewingActivity(activity)}
                          title="Preview how it looks in What I'm Upto"
                          className="p-1.5 rounded-lg text-foreground-secondary hover:text-accent hover:bg-surface-elevated transition-colors text-xs flex items-center gap-1 font-mono"
                        >
                          <Eye className="w-3.5 h-3.5" /> Preview
                        </button>

                        <button
                          onClick={() => {
                            setActivityToEdit(activity);
                            setIsActivityModalOpen(true);
                          }}
                          title="Edit activity"
                          className="p-1.5 rounded-lg text-foreground-secondary hover:text-foreground hover:bg-surface-elevated transition-colors text-xs flex items-center gap-1 font-mono"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>

                        <button
                          onClick={() => handleDeleteActivity(activity)}
                          title="Delete activity"
                          className="p-1.5 rounded-lg text-foreground-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Activity Create / Edit Modal */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSuccess={() => {
          fetchData();
        }}
        activityToEdit={activityToEdit}
        defaultType={defaultCategoryForNew}
      />

      {/* Section Card Customization Modal */}
      <SectionCardModal
        isOpen={isCardModalOpen}
        card={cardToEdit}
        onClose={() => {
          setIsCardModalOpen(false);
          setCardToEdit(null);
        }}
        onSuccess={(updatedCard) => {
          setSectionCards((prev) =>
            prev.map((c) => (c.category === updatedCard.category ? updatedCard : c))
          );
        }}
      />

      {/* Media Library Modal */}
      <AssetManagerModal
        isOpen={isAssetManagerOpen}
        onClose={() => setIsAssetManagerOpen(false)}
        onSelect={() => {}}
      />

      {/* Live Preview Modal */}
      {previewingActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface border border-border rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Standardized Card Preview</h3>
              <button
                onClick={() => setPreviewingActivity(null)}
                className="text-foreground-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <ActivityPreview activity={previewingActivity} />
            <div className="text-center pt-2">
              <button
                onClick={() => setPreviewingActivity(null)}
                className="w-full py-2 rounded-xl bg-surface-elevated border border-border text-xs text-foreground font-mono hover:border-accent"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
