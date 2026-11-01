import { z } from 'zod';

export const ActivityTypeEnum = z.enum(['project', 'learning', 'reading', 'gaming']);
export const ActivityStatusEnum = z.enum(['planned', 'ongoing', 'completed', 'paused']);
export const ActivityVisibilityEnum = z.enum(['public', 'unlisted', 'private']);

export const LearningTopicSchema = z.object({
  title: z.string().min(1, 'Topic title is required'),
  completed: z.boolean().default(false),
});

export const LearningMetadataSchema = z.object({
  platform: z.string().optional(),
  topics: z.array(LearningTopicSchema).optional(),
  progress: z.number().min(0).max(100).optional(),
  milestones: z.array(z.string()).optional(),
  notes: z.string().optional(),
}).passthrough();

export const ProjectMetadataSchema = z.object({
  technologies: z.array(z.string()).optional(),
  githubUrl: z.string().url().or(z.literal('')).optional(),
  liveDemoUrl: z.string().url().or(z.literal('')).optional(),
  keyContributions: z.array(z.string()).optional(),
  projectImages: z.array(z.string()).optional(),
}).passthrough();

export const ReadingMetadataSchema = z.object({
  author: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  notes: z.string().optional(),
}).passthrough();

export const GamingMetadataSchema = z.object({
  platform: z.string().optional(),
  notes: z.string().optional(),
}).passthrough();

export const ActivitySchema = z.object({
  type: ActivityTypeEnum,
  title: z.string().min(1, 'Title is required').max(150),
  description: z.string().max(1000).optional().default(''),
  coverImage: z.string().optional().default(''),
  assetId: z.string().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  status: ActivityStatusEnum.default('ongoing'),
  priority: z.coerce.number().int().default(1),
  isFeatured: z.boolean().default(false),
  isCurrent: z.boolean().default(false),
  visibility: ActivityVisibilityEnum.default('public'),
  metadata: z.record(z.string(), z.any()).optional().default({}),
});

export const LoginSchema = z.object({
  email: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const AssetUploadMetadataSchema = z.object({
  name: z.string().optional(),
  alt: z.string().optional().default(''),
  folder: z.string().optional().default('portfolio-assets'),
});
