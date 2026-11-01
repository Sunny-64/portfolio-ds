import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Cloudinary configuration (strictly server-side)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

export const CLOUDINARY_FOLDER = 'portfolio-assets';

export interface UploadOptions {
  name?: string;
  alt?: string;
  folder?: string;
}

export interface UploadResult {
  url: string;
  publicId: string;
  assetId?: string;
  folder: string;
  format: string;
  resourceType: string;
  width: number;
  height: number;
  bytes: number;
  name: string;
  alt: string;
}

/**
 * Uploads a buffer or base64 data URI to Cloudinary inside the designated folder.
 * Uses both `asset_folder` and `folder` for full compatibility with dynamic and fixed folder modes.
 */
export async function uploadToCloudinary(
  fileBufferOrDataUri: Buffer | string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const folder = options.folder || CLOUDINARY_FOLDER;
  const fileName = options.name ? options.name.replace(/[^a-zA-Z0-9_-]/g, '_') : undefined;

  return new Promise((resolve, reject) => {
    const uploadOptions: Record<string, unknown> = {
      asset_folder: folder,
      folder: folder,
      resource_type: 'image',
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

    if (fileName) {
      uploadOptions.public_id = `${folder}/${fileName}_${Date.now()}`;
    }

    const handleUploadResponse = (err: unknown, result?: UploadApiResponse) => {
      if (err || !result) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : typeof err === 'object' && err !== null && 'message' in err
            ? String((err as { message: unknown }).message)
            : 'Unknown Cloudinary upload error';

        if (errorMsg.includes('missing permissions') || errorMsg.includes('403')) {
          reject(
            new Error(
              `Cloudinary Access Key is missing upload permissions (actions=["create"]). ` +
                `Please verify in Cloudinary Console -> Settings -> Access Keys that this API Key has "Media management" enabled.`
            )
          );
          return;
        }

        reject(new Error(`Cloudinary upload failed: ${errorMsg}`));
        return;
      }

      resolve({
        url: result.secure_url,
        publicId: result.public_id,
        assetId: result.asset_id,
        folder: result.asset_folder || result.folder || folder,
        format: result.format,
        resourceType: result.resource_type,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        name: options.name || result.original_filename || result.public_id,
        alt: options.alt || '',
      });
    };

    if (typeof fileBufferOrDataUri === 'string') {
      cloudinary.uploader.upload(fileBufferOrDataUri, uploadOptions, handleUploadResponse);
    } else {
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, handleUploadResponse);
      uploadStream.end(fileBufferOrDataUri);
    }
  });
}

/**
 * Deletes an asset from Cloudinary using its publicId.
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: 'image',
    });
    return result.result === 'ok' || result.result === 'not found';
  } catch (err) {
    console.error('Error deleting from Cloudinary:', err);
    throw err;
  }
}

/**
 * Generates an optimized Cloudinary delivery URL with quality auto, format auto, and dimensions.
 */
export function getOptimizedImageUrl(
  publicIdOrUrl: string,
  options: { width?: number; height?: number; crop?: string; quality?: string | number } = {}
): string {
  if (!publicIdOrUrl) return '';

  // If already a full URL and not Cloudinary, return as is
  if (publicIdOrUrl.startsWith('http') && !publicIdOrUrl.includes('cloudinary.com')) {
    return publicIdOrUrl;
  }

  // Extract publicId if a full Cloudinary URL is passed
  let publicId = publicIdOrUrl;
  if (publicIdOrUrl.includes('/upload/')) {
    const parts = publicIdOrUrl.split('/upload/');
    if (parts.length > 1) {
      // Remove any existing transformations e.g. v12345/folder/image.png
      const afterUpload = parts[1].replace(/^(?:[a-z]_[^/]+,)*v\d+\//, '');
      publicId = afterUpload.replace(/\.[a-zA-Z0-9]+$/, '');
    }
  }

  return cloudinary.url(publicId, {
    secure: true,
    fetch_format: 'auto',
    quality: options.quality || 'auto',
    width: options.width,
    height: options.height,
    crop: options.crop || (options.width && options.height ? 'fill' : undefined),
  });
}
