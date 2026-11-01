'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Upload,
  X,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { AssetDocument } from '@/types/cms';

interface AssetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (assetUrl: string, assetId?: string) => void;
  currentSelectedUrl?: string;
}

export function AssetManagerModal({
  isOpen,
  onClose,
  onSelect,
  currentSelectedUrl,
}: AssetManagerModalProps) {
  const [assets, setAssets] = useState<AssetDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    fetch('/api/dashboard/assets')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load assets');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setAssets(data.assets || []);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error loading assets');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Handle upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name.replace(/\.[^.]+$/, ''));
      formData.append('alt', file.name);

      const res = await fetch('/api/dashboard/assets', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Upload failed');
        return;
      }

      setSuccess('Image uploaded successfully to portfolio-assets!');
      setAssets((prev) => [data.asset, ...prev]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      setError('Upload failed due to network error');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle delete
  const handleDelete = async (asset: AssetDocument) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${asset.name}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setError(null);
    setDeletingId(asset.publicId);

    try {
      const res = await fetch(`/api/dashboard/assets/${encodeURIComponent(asset.publicId)}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to delete asset');
        return;
      }

      setAssets((prev) => prev.filter((a) => a.publicId !== asset.publicId));
      setSuccess('Asset deleted safely.');
    } catch {
      setError('Network error while deleting asset');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl max-h-[85vh] bg-surface border border-border/80 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-accent" />
              Cloudinary Asset Manager
            </h2>
            <p className="text-xs text-foreground-muted font-mono">
              Folder: <span className="text-accent">portfolio-assets</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-surface-elevated text-foreground-muted hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notices */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-foreground-muted space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
              <p className="text-xs font-mono">Loading assets from Cloudinary & database...</p>
            </div>
          ) : assets.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-xl space-y-3">
              <ImageIcon className="w-10 h-10 text-foreground-muted mx-auto stroke-1" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">No uploaded images yet</p>
                <p className="text-xs text-foreground-muted">
                  Upload an image to store it in your Cloudinary `portfolio-assets` folder.
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-xs text-foreground hover:border-accent transition-colors"
              >
                <Upload className="w-3.5 h-3.5" /> Choose file
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {assets.map((asset) => {
                const isSelected = currentSelectedUrl === asset.url;
                const isDeleting = deletingId === asset.publicId;

                return (
                  <div
                    key={asset.publicId}
                    className={`group relative rounded-xl border transition-all overflow-hidden bg-surface-elevated flex flex-col justify-between ${
                      isSelected
                        ? 'border-accent ring-2 ring-accent/30'
                        : 'border-border/80 hover:border-accent/60'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-square w-full bg-black/20 overflow-hidden">
                      <Image
                        src={asset.url}
                        alt={asset.alt || asset.name}
                        fill
                        sizes="180px"
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                      />

                      {/* Overlay selection tick */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center shadow-md">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    {/* Metadata & Actions */}
                    <div className="p-2.5 space-y-1 bg-surface">
                      <p className="text-xs font-medium text-foreground truncate" title={asset.name}>
                        {asset.name}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-foreground-muted font-mono">
                        <span>{asset.width ? `${asset.width}×${asset.height}` : asset.format}</span>
                        <span>{asset.bytes ? `${(asset.bytes / 1024).toFixed(0)} KB` : ''}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/40 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onSelect(asset.url, asset.publicId);
                            onClose();
                          }}
                          className="flex-1 py-1 px-2 rounded-lg bg-accent/10 hover:bg-accent hover:text-white text-accent text-[11px] font-medium transition-colors text-center"
                        >
                          Select
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(asset)}
                          disabled={isDeleting}
                          title="Delete asset (checks if used)"
                          className="p-1 rounded-lg text-foreground-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border flex items-center justify-between bg-surface-elevated/40">
          <p className="text-xs text-foreground-muted font-mono">
            Direct Cloudinary secure delivery URLs with auto-optimization
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-border text-xs text-foreground hover:bg-surface-elevated transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
