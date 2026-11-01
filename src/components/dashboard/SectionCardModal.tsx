'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Loader2,
  AlertCircle,
  Laptop,
  BookOpen,
  BookText,
  Gamepad2,
  Sparkles,
  Terminal,
  Code,
  Layers,
  Check,
} from 'lucide-react';
import { SectionCardDocument } from '@/types/cms';
import { AssetManagerModal } from './AssetManagerModal';
import { ActivityPreview } from './ActivityPreview';

interface SectionCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedCard: SectionCardDocument) => void;
  card: SectionCardDocument | null;
}

const AVAILABLE_ICONS = [
  { name: 'Laptop', label: 'Laptop (Projects)', icon: Laptop },
  { name: 'BookOpen', label: 'Book Open (Learning)', icon: BookOpen },
  { name: 'BookText', label: 'Book Text (Reading)', icon: BookText },
  { name: 'Gamepad2', label: 'Gamepad (Gaming)', icon: Gamepad2 },
  { name: 'Sparkles', label: 'Sparkles', icon: Sparkles },
  { name: 'Terminal', label: 'Terminal', icon: Terminal },
  { name: 'Code', label: 'Code', icon: Code },
  { name: 'Layers', label: 'Layers', icon: Layers },
];

export function SectionCardModal({ isOpen, onClose, onSuccess, card }: SectionCardModalProps) {
  if (!isOpen || !card) return null;

  return (
    <SectionCardModalContent
      key={card.category}
      card={card}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}

function SectionCardModalContent({
  card,
  onClose,
  onSuccess,
}: {
  card: SectionCardDocument;
  onClose: () => void;
  onSuccess: (updatedCard: SectionCardDocument) => void;
}) {
  const [title, setTitle] = useState(card.title || '');
  const [subtitle, setSubtitle] = useState(card.subtitle || '');
  const [description, setDescription] = useState(card.description || '');
  const [coverImage, setCoverImage] = useState(card.coverImage || '');
  const [iconName, setIconName] = useState(card.iconName || 'Laptop');
  const [order, setOrder] = useState<number>(card.order || 1);
  const [isEnabled, setIsEnabled] = useState<boolean>(card.isEnabled !== false);

  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent background body scrolling to eliminate double scrollbars
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Card title is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload: Partial<SectionCardDocument> = {
      category: card.category,
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      coverImage: coverImage.trim(),
      iconName,
      order: Number(order) || 1,
      isEnabled,
      linkHref: card.linkHref,
    };

    try {
      const res = await fetch('/api/dashboard/section-cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save card customization');
      }

      onSuccess(data.card);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating card');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview card state
  const previewCard: Partial<SectionCardDocument> = {
    category: card.category,
    title: title || 'Title',
    subtitle: subtitle || 'Subtitle',
    description: description || 'Description...',
    coverImage,
    iconName,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-hidden">
      <div className="relative w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/80 shrink-0">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Customize {card.title} Card
            </h2>
            <p className="text-[11px] text-foreground-muted font-mono">
              Configure how this category appears in the &quot;What I&apos;m Upto&quot; homepage grid
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-3 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 shrink-0">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Form Fields Column */}
            <div className="md:col-span-7 space-y-3">
              {/* Card Title */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-foreground-secondary mb-1">
                  Card Title <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Working On, Learning, Reading, Playing"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-foreground text-xs focus:outline-none focus:border-accent"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-foreground-secondary mb-1">
                  Subtitle (Primary Highlight)
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Data Science & Analytics, Standby Mode, NieR:Automata"
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-foreground text-xs focus:outline-none focus:border-accent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-foreground-secondary mb-1">
                  Card Description (Muted Text)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Currently focusing on Excel, SQL and Python."
                  className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-foreground text-xs focus:outline-none focus:border-accent resize-none"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-foreground-secondary mb-1">
                  Cover Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://res.cloudinary.com/... or /images/now/..."
                    className="flex-1 px-3 py-2 rounded-xl bg-surface-elevated border border-border text-foreground text-xs font-mono focus:outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setIsAssetPickerOpen(true)}
                    className="px-3 py-2 rounded-xl bg-surface-elevated border border-border hover:border-accent text-foreground text-xs font-mono flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5 text-accent" />
                    <span>Media Library</span>
                  </button>
                </div>
              </div>

              {/* Icon Selector & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-foreground-secondary mb-1">
                    Category Icon
                  </label>
                  <select
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-foreground text-xs font-mono focus:outline-none focus:border-accent"
                  >
                    {AVAILABLE_ICONS.map((opt) => (
                      <option key={opt.name} value={opt.name}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-foreground-secondary mb-1">
                    Display Order (1 - 4)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-foreground text-xs font-mono focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Visibility Toggle */}
              <div className="pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl bg-surface-elevated border border-border/80 hover:border-accent/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => setIsEnabled(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-accent focus:ring-accent bg-surface border-border"
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-medium text-foreground block">
                      Enable card on homepage
                    </span>
                    <span className="text-[10px] text-foreground-muted block">
                      When unchecked, this card is hidden from &quot;What I&apos;m Upto&quot;
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Live Preview Column */}
            <div className="md:col-span-5 flex flex-col justify-center items-center p-3 rounded-xl bg-surface-elevated/30 border border-border/60">
              <ActivityPreview card={previewCard} />
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 mt-2 border-t border-border shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 rounded-xl border border-border text-foreground-secondary hover:text-foreground text-xs font-mono transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-all shadow-md shadow-accent/20 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Cloudinary Asset Manager Modal */}
      <AssetManagerModal
        isOpen={isAssetPickerOpen}
        onClose={() => setIsAssetPickerOpen(false)}
        onSelect={(assetUrl) => {
          setCoverImage(assetUrl);
          setIsAssetPickerOpen(false);
        }}
      />
    </div>
  );
}
