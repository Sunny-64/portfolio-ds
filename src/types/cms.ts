import { ObjectId } from 'mongodb';

export type ActivityType = 'project' | 'learning' | 'reading' | 'gaming';
export type ActivityStatus = 'planned' | 'ongoing' | 'completed' | 'paused';
export type ActivityVisibility = 'public' | 'unlisted' | 'private';

export interface LearningTopic {
  title: string;
  completed: boolean;
}

export interface LearningMetadata {
  platform?: string;
  topics?: LearningTopic[];
  progress?: number;
  milestones?: string[];
  notes?: string;
}

export interface ProjectMetadata {
  technologies?: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  keyContributions?: string[];
  projectImages?: string[];
}

export interface ReadingMetadata {
  author?: string;
  rating?: number;
  notes?: string;
}

export interface GamingMetadata {
  platform?: string;
  notes?: string;
}

export interface ActivityDocument {
  _id?: ObjectId | string;
  type: ActivityType;
  title: string;
  description?: string;
  coverImage?: string; // Cloudinary secure URL or asset reference
  assetId?: string; // MongoDB Asset _id or Cloudinary publicId
  startDate?: string | null;
  endDate?: string | null;
  status: ActivityStatus;
  priority: number;
  isFeatured: boolean;
  isCurrent: boolean;
  visibility: ActivityVisibility;
  metadata?: LearningMetadata | ProjectMetadata | ReadingMetadata | GamingMetadata | Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssetDocument {
  _id?: ObjectId | string;
  name: string;
  url: string; // Cloudinary secure URL
  publicId: string;
  assetId?: string;
  folder: string;
  format: string;
  resourceType: string;
  width: number;
  height: number;
  bytes: number;
  alt: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InteractionDocumentExtended {
  _id?: ObjectId | string;
  type: string;
  target?: string;
  page?: string;
  referrer?: string;
  visitorId?: string;
  sessionId?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  os?: string;
  browser?: string;
  actorType: 'visitor' | 'admin';
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface AdminLogDocument {
  _id?: ObjectId | string;
  actorType: 'admin';
  action: string;
  endpoint?: string;
  details?: Record<string, unknown>;
  deviceType?: string;
  os?: string;
  browser?: string;
  timestamp: Date;
}

export interface SectionCardDocument {
  _id?: ObjectId | string;
  category: 'project' | 'learning' | 'reading' | 'gaming';
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  iconName: string; // 'Laptop' | 'BookOpen' | 'BookText' | 'Gamepad2' | string
  order: number;
  isEnabled: boolean;
  linkHref?: string;
  updatedAt?: Date;
}
