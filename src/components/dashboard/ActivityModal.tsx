'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Check,
  Loader2,
  AlertCircle,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  ActivityDocument,
  ActivityType,
  ActivityStatus,
  LearningTopic,
  LearningMetadata,
  ProjectMetadata,
  ReadingMetadata,
  GamingMetadata,
} from '@/types/cms';
import { AssetManagerModal } from './AssetManagerModal';
import { ActivityPreview } from './ActivityPreview';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  activityToEdit?: ActivityDocument | null;
  defaultType?: ActivityType;
}

export function ActivityModal(props: ActivityModalProps) {
  if (!props.isOpen) return null;

  return (
    <ActivityModalContent
      key={props.activityToEdit?._id?.toString() || `new_${props.defaultType || 'learning'}`}
      {...props}
    />
  );
}

function ActivityModalContent({
  onClose,
  onSuccess,
  activityToEdit,
  defaultType = 'learning',
}: ActivityModalProps) {
  const isEditing = Boolean(activityToEdit);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Initial metadata extractions
  const learningMeta = (activityToEdit?.type === 'learning' ? activityToEdit?.metadata : undefined) as LearningMetadata | undefined;
  const projectMeta = (activityToEdit?.type === 'project' ? activityToEdit?.metadata : undefined) as ProjectMetadata | undefined;
  const readingMeta = (activityToEdit?.type === 'reading' ? activityToEdit?.metadata : undefined) as ReadingMetadata | undefined;
  const gamingMeta = (activityToEdit?.type === 'gaming' ? activityToEdit?.metadata : undefined) as GamingMetadata | undefined;

  // Core Fields
  const [type, setType] = useState<ActivityType>(activityToEdit?.type || defaultType);
  const [title, setTitle] = useState(activityToEdit?.title || '');
  const [description, setDescription] = useState(activityToEdit?.description || '');
  const [coverImage, setCoverImage] = useState(activityToEdit?.coverImage || '');
  const [startDate, setStartDate] = useState(activityToEdit?.startDate || '');
  const [endDate, setEndDate] = useState(activityToEdit?.endDate || '');
  const [status, setStatus] = useState<ActivityStatus>(activityToEdit?.status || 'ongoing');
  const [priority, setPriority] = useState<number>(activityToEdit?.priority || 1);
  const [isCurrent, setIsCurrent] = useState(activityToEdit?.isCurrent ?? true);
  const [isFeatured, setIsFeatured] = useState(activityToEdit?.isFeatured ?? false);

  // Category Metadata: Learning
  const [learningPlatform, setLearningPlatform] = useState(learningMeta?.platform || '');
  const [learningTopics, setLearningTopics] = useState<LearningTopic[]>(learningMeta?.topics || []);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [learningProgress, setLearningProgress] = useState<number | ''>(
    typeof learningMeta?.progress === 'number' ? learningMeta.progress : ''
  );
  const [learningNotes, setLearningNotes] = useState(learningMeta?.notes || '');

  // Category Metadata: Projects
  const [projectTech, setProjectTech] = useState(
    Array.isArray(projectMeta?.technologies) ? projectMeta.technologies.join(', ') : ''
  );
  const [projectGithub, setProjectGithub] = useState(projectMeta?.githubUrl || '');
  const [projectDemo, setProjectDemo] = useState(projectMeta?.liveDemoUrl || '');
  const [projectContributions, setProjectContributions] = useState(
    Array.isArray(projectMeta?.keyContributions) ? projectMeta.keyContributions.join('\n') : ''
  );

  // Category Metadata: Reading
  const [readingAuthor, setReadingAuthor] = useState(readingMeta?.author || '');
  const [readingRating, setReadingRating] = useState<number | ''>(
    typeof readingMeta?.rating === 'number' ? readingMeta.rating : 5
  );
  const [readingNotes, setReadingNotes] = useState(readingMeta?.notes || '');

  // Category Metadata: Gaming
  const [gamingPlatform, setGamingPlatform] = useState(gamingMeta?.platform || '');
  const [gamingNotes, setGamingNotes] = useState(gamingMeta?.notes || '');

  // State
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Topic handlers
  const handleAddTopic = () => {
    if (!newTopicTitle.trim()) return;
    setLearningTopics((prev) => [...prev, { title: newTopicTitle.trim(), completed: false }]);
    setNewTopicTitle('');
  };

  const handleToggleTopic = (index: number) => {
    setLearningTopics((prev) =>
      prev.map((t, i) => (i === index ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleRemoveTopic = (index: number) => {
    setLearningTopics((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Build category-specific metadata
    let metadata: Record<string, unknown> = {};

    if (type === 'learning') {
      metadata = {
        platform: learningPlatform.trim() || undefined,
        topics: learningTopics,
        progress: typeof learningProgress === 'number' ? learningProgress : undefined,
        notes: learningNotes.trim() || undefined,
      };
    } else if (type === 'project') {
      metadata = {
        technologies: projectTech
          ? projectTech.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        githubUrl: projectGithub.trim() || undefined,
        liveDemoUrl: projectDemo.trim() || undefined,
        keyContributions: projectContributions
          ? projectContributions.split('\n').map((c) => c.trim()).filter(Boolean)
          : [],
      };
    } else if (type === 'reading') {
      metadata = {
        author: readingAuthor.trim() || undefined,
        rating: typeof readingRating === 'number' ? readingRating : undefined,
        notes: readingNotes.trim() || undefined,
      };
    } else if (type === 'gaming') {
      metadata = {
        platform: gamingPlatform.trim() || undefined,
        notes: gamingNotes.trim() || undefined,
      };
    }

    const payload = {
      type,
      title: title.trim(),
      description: description.trim(),
      coverImage: coverImage.trim(),
      startDate: startDate || null,
      endDate: endDate || null,
      status,
      priority: Number(priority) || 1,
      isCurrent,
      isFeatured,
      visibility: 'public',
      metadata,
    };

    try {
      const url = isEditing
        ? `/api/dashboard/activities/${activityToEdit!._id}`
        : '/api/dashboard/activities';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save activity');
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setError('Network error while saving activity');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Construct partial activity for preview
  const previewActivity: Partial<ActivityDocument> = {
    type,
    title: title || (type === 'learning' ? 'Subject Name' : 'Title'),
    description,
    coverImage,
    priority,
    isCurrent,
    metadata:
      type === 'learning'
        ? { platform: learningPlatform, topics: learningTopics }
        : type === 'reading'
        ? { author: readingAuthor }
        : type === 'gaming'
        ? { platform: gamingPlatform }
        : {},
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-hidden">
      <div className="w-full max-w-4xl bg-surface border border-border/80 rounded-2xl flex flex-col shadow-2xl max-h-[92vh] my-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-elevated/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {isEditing ? `Edit Activity: ${activityToEdit?.title}` : 'Create New Activity'}
              </h2>
              <p className="text-xs text-foreground-muted font-mono">
                Category: <span className="text-accent uppercase font-semibold">{type}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-elevated text-foreground-muted hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {/* Main Grid: Form Left, Preview Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {/* Category Selector (when creating new) */}
              {!isEditing && (
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
                    Activity Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['learning', 'project', 'reading', 'gaming'] as ActivityType[]).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setType(cat)}
                        className={`py-2 px-3 rounded-xl text-xs font-mono capitalize transition-all border ${
                          type === cat
                            ? 'bg-accent/15 border-accent text-accent font-semibold shadow-sm'
                            : 'bg-surface-elevated border-border text-foreground-secondary hover:text-foreground hover:border-accent/40'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Title & Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
                  {type === 'learning'
                    ? 'Subject Name (e.g. Excel, SQL, Python)'
                    : type === 'gaming'
                    ? 'Game Title (e.g. NieR:Automata)'
                    : type === 'reading'
                    ? 'Book Title'
                    : 'Project Title'}
                  <span className="text-accent ml-1">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    type === 'learning'
                      ? 'Excel'
                      : type === 'gaming'
                      ? 'NieR:Automata'
                      : type === 'reading'
                      ? 'Short Stories Collection'
                      : 'Project Name'
                  }
                  className="w-full px-3.5 py-2.5 bg-surface-elevated border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
                  Description / Subtitle
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    type === 'learning'
                      ? 'Advanced formulas, pivot tables, data modeling, Power Query'
                      : type === 'gaming'
                      ? 'Game of the YoRHa Edition'
                      : type === 'reading'
                      ? 'Collection of short stories'
                      : 'Brief overview of project'
                  }
                  className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>

              {/* Cover Image (Reading, Gaming, Project) */}
              {(type === 'reading' || type === 'gaming' || type === 'project') && (
                <div className="space-y-1.5">
                  <div className="text-xs font-mono uppercase tracking-wider text-foreground-secondary flex items-center justify-between">
                    <span>Cover Image</span>
                    <button
                      type="button"
                      onClick={() => setIsAssetPickerOpen(true)}
                      className="text-accent text-[11px] font-mono hover:underline flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" /> Select / Upload Cloudinary Asset
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="/images/now/... or https://res.cloudinary.com/..."
                      className="flex-1 px-3.5 py-2 bg-surface-elevated border border-border rounded-xl text-xs font-mono text-foreground focus:outline-none focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={() => setIsAssetPickerOpen(true)}
                      className="px-3.5 py-2 bg-surface-elevated border border-border rounded-xl text-xs font-medium text-foreground hover:border-accent transition-colors"
                    >
                      Browse
                    </button>
                  </div>
                </div>
              )}

              {/* Status & Priority Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ActivityStatus)}
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-accent"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="planned">Planned</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
                    Display Priority
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-xl text-xs font-mono text-foreground focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1 flex items-end">
                  <label className="flex items-center gap-2 p-2 bg-surface-elevated border border-border rounded-xl text-xs text-foreground cursor-pointer w-full hover:border-accent transition-colors">
                    <input
                      type="checkbox"
                      checked={isCurrent}
                      onChange={(e) => setIsCurrent(e.target.checked)}
                      className="rounded accent-accent w-4 h-4"
                    />
                    <span className="font-medium text-xs">Currently Active</span>
                  </label>
                </div>
              </div>

              {/* Dates & Featured Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
                    Start Date (optional)
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-xl text-xs font-mono text-foreground focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
                    End Date (optional)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-xl text-xs font-mono text-foreground focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5 flex items-end">
                  <label className="flex items-center gap-2 p-2 bg-surface-elevated border border-border rounded-xl text-xs text-foreground cursor-pointer w-full hover:border-accent transition-colors">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded accent-accent w-4 h-4"
                    />
                    <span className="font-medium text-xs">Featured Item</span>
                  </label>
                </div>
              </div>

              {/* ======================================================== */}
              {/* Category-Specific Form Sections */}
              {/* ======================================================== */}

              {/* 1. LEARNING FORM */}
              {type === 'learning' && (
                <div className="p-4 rounded-xl border border-border/80 bg-surface-elevated/30 space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Learning Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-foreground-muted">Platform / Source</label>
                      <input
                        type="text"
                        value={learningPlatform}
                        onChange={(e) => setLearningPlatform(e.target.value)}
                        placeholder="Newton School, DataCamp, Practice"
                        className="w-full px-3 py-1.5 bg-surface-elevated border border-border rounded-lg text-xs text-foreground"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-foreground-muted">Progress Percentage (%)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={learningProgress}
                        onChange={(e) =>
                          setLearningProgress(e.target.value === '' ? '' : Number(e.target.value))
                        }
                        placeholder="85"
                        className="w-full px-3 py-1.5 bg-surface-elevated border border-border rounded-lg text-xs font-mono text-foreground"
                      />
                    </div>
                  </div>

                  {/* Topics Covered */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-foreground-muted block">
                      Topics Covered &amp; Mastery
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTopicTitle}
                        onChange={(e) => setNewTopicTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTopic();
                          }
                        }}
                        placeholder="Add topic (e.g. Window Functions, Pivot Tables)..."
                        className="flex-1 px-3 py-1.5 bg-surface-elevated border border-border rounded-lg text-xs text-foreground"
                      />
                      <button
                        type="button"
                        onClick={handleAddTopic}
                        className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs flex items-center gap-1 font-medium hover:bg-accent-hover transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>

                    {learningTopics.length > 0 && (
                      <div className="space-y-1.5 pt-1 max-h-36 overflow-y-auto custom-scrollbar pr-1">
                        {learningTopics.map((topic, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg bg-surface-elevated border border-border/60 text-xs"
                          >
                            <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                              <input
                                type="checkbox"
                                checked={topic.completed}
                                onChange={() => handleToggleTopic(idx)}
                                className="accent-accent rounded w-3.5 h-3.5"
                              />
                              <span
                                className={`truncate ${
                                  topic.completed ? 'text-foreground font-medium' : 'text-foreground-muted'
                                }`}
                              >
                                {topic.title}
                              </span>
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemoveTopic(idx)}
                              className="text-foreground-muted hover:text-red-400 p-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-foreground-muted">Personal Notes</label>
                    <textarea
                      rows={2}
                      value={learningNotes}
                      onChange={(e) => setLearningNotes(e.target.value)}
                      placeholder="Notes on what you're focusing on..."
                      className="w-full px-3 py-1.5 bg-surface-elevated border border-border rounded-lg text-xs text-foreground resize-none"
                    />
                  </div>
                </div>
              )}

              {/* 2. PROJECTS FORM */}
              {type === 'project' && (
                <div className="p-4 rounded-xl border border-border/80 bg-surface-elevated/30 space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Project Metadata
                  </h3>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-foreground-muted">
                      Technologies Used (comma separated)
                    </label>
                    <input
                      type="text"
                      value={projectTech}
                      onChange={(e) => setProjectTech(e.target.value)}
                      placeholder="Python, SQL, React, Tailwind CSS"
                      className="w-full px-3 py-1.5 bg-surface-elevated border border-border rounded-lg text-xs text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-foreground-muted">GitHub Repository URL</label>
                      <input
                        type="url"
                        value={projectGithub}
                        onChange={(e) => setProjectGithub(e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full px-3 py-1.5 bg-surface-elevated border border-border rounded-lg text-xs text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-foreground-muted">Live Demo URL</label>
                      <input
                        type="url"
                        value={projectDemo}
                        onChange={(e) => setProjectDemo(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 bg-surface-elevated border border-border rounded-lg text-xs text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-foreground-muted">
                      Key Contributions (one per line)
                    </label>
                    <textarea
                      rows={2}
                      value={projectContributions}
                      onChange={(e) => setProjectContributions(e.target.value)}
                      placeholder="Designed data model&#10;Built dashboard filters"
                      className="w-full px-3 py-1.5 bg-surface-elevated border border-border rounded-lg text-xs text-foreground resize-none"
                    />
                  </div>
                </div>
              )}

              {/* 3. READING FORM */}
              {type === 'reading' && (
                <div className="p-4 rounded-xl border border-border/80 bg-surface-elevated/30 space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Book Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-foreground-muted">Author</label>
                      <input
                        type="text"
                        value={readingAuthor}
                        onChange={(e) => setReadingAuthor(e.target.value)}
                        placeholder="Roald Dahl"
                        className="w-full px-3 py-1.5 bg-surface-elevated border border-border rounded-lg text-xs text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-foreground-muted">Rating (1 to 5 stars)</label>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={readingRating}
                        onChange={(e) =>
                          setReadingRating(e.target.value === '' ? '' : Number(e.target.value))
                        }
                        className="w-full px-3 py-1.5 bg-surface-elevated border border-border rounded-lg text-xs text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-foreground-muted">Personal Notes</label>
                    <textarea
                      rows={2}
                      value={readingNotes}
                      onChange={(e) => setReadingNotes(e.target.value)}
                      placeholder="Personal impressions and notes..."
                      className="w-full px-3 py-1.5 bg-surface-elevated border border-border rounded-lg text-xs text-foreground resize-none"
                    />
                  </div>
                </div>
              )}

              {/* 4. GAMING FORM */}
              {type === 'gaming' && (
                <div className="p-4 rounded-xl border border-border/80 bg-surface-elevated/30 space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Game Details
                  </h3>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-foreground-muted">Platform (optional)</label>
                    <input
                      type="text"
                      value={gamingPlatform}
                      onChange={(e) => setGamingPlatform(e.target.value)}
                      placeholder="PC / Steam, PlayStation 5"
                      className="w-full px-3 py-1.5 bg-surface-elevated border border-border rounded-lg text-xs text-foreground"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-foreground-muted">Notes</label>
                    <textarea
                      rows={2}
                      value={gamingNotes}
                      onChange={(e) => setGamingNotes(e.target.value)}
                      placeholder="Optional notes..."
                      className="w-full px-3 py-1.5 bg-surface-elevated border border-border rounded-lg text-xs text-foreground resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Live Card Preview Column */}
            <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-border/60 pt-6 lg:pt-0 lg:pl-6 flex flex-col items-center">
              <ActivityPreview activity={previewActivity} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-xs text-foreground-secondary hover:text-foreground hover:bg-surface-elevated transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-all shadow-md shadow-accent/20 flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Save Changes' : 'Create Activity'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Cloudinary Asset Picker Modal */}
      <AssetManagerModal
        isOpen={isAssetPickerOpen}
        onClose={() => setIsAssetPickerOpen(false)}
        currentSelectedUrl={coverImage}
        onSelect={(selectedUrl) => {
          setCoverImage(selectedUrl);
        }}
      />
    </div>
  );
}
