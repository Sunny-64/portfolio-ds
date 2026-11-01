import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth, logAdminAction } from '@/lib/auth';
import { getAssetsCollection } from '@/lib/mongodb';
import { uploadToCloudinary } from '@/lib/cloudinary';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) return auth.response;

  try {
    const assetsCollection = await getAssetsCollection();
    if (!assetsCollection) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    const assets = await assetsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ assets });
  } catch (err) {
    console.error('Failed to list assets:', err);
    return NextResponse.json({ error: 'Failed to list assets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) return auth.response;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const name = (formData.get('name') as string) || '';
    const alt = (formData.get('alt') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Allowed types: JPG, PNG, WEBP, GIF, SVG.` },
        { status: 400 }
      );
    }

    // 2. Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum size is 10MB.` },
        { status: 400 }
      );
    }

    // 3. Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Upload to Cloudinary server-side
    const uploadResult = await uploadToCloudinary(buffer, {
      name: name || file.name.replace(/\.[^.]+$/, ''),
      alt: alt || name || file.name,
      folder: 'portfolio-assets',
    });

    // 5. Store record in MongoDB Asset model
    const assetsCollection = await getAssetsCollection();
    if (!assetsCollection) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    const assetDoc = {
      name: uploadResult.name,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      assetId: uploadResult.assetId,
      folder: uploadResult.folder,
      format: uploadResult.format,
      resourceType: uploadResult.resourceType,
      width: uploadResult.width,
      height: uploadResult.height,
      bytes: uploadResult.bytes,
      alt: uploadResult.alt,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const insertResult = await assetsCollection.insertOne(assetDoc);

    logAdminAction('upload_asset', request, {
      publicId: uploadResult.publicId,
      name: uploadResult.name,
    }).catch(() => {});

    return NextResponse.json({
      ok: true,
      asset: {
        _id: insertResult.insertedId,
        ...assetDoc,
      },
    }, { status: 201 });
  } catch (err) {
    console.error('Asset upload error:', err);
    const message = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
