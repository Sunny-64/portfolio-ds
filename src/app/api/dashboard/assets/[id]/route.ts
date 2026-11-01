import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { requireAdminAuth, logAdminAction } from '@/lib/auth';
import { getAssetsCollection, getActivitiesCollection } from '@/lib/mongodb';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth(request);
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const assetsCollection = await getAssetsCollection();
    const activitiesCollection = await getActivitiesCollection();

    if (!assetsCollection || !activitiesCollection) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    let objectId: ObjectId | null = null;
    try {
      objectId = new ObjectId(id);
    } catch {
      // id might be publicId
    }

    const asset = await assetsCollection.findOne({
      $or: [
        ...(objectId ? [{ _id: objectId }] : []),
        { publicId: id },
        { assetId: id },
      ],
    });

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    // Check whether asset is referenced by any activity
    const referencingActivity = await activitiesCollection.findOne({
      $or: [
        { coverImage: asset.url },
        { assetId: asset._id?.toString() },
        { assetId: asset.publicId },
        { 'metadata.projectImages': asset.url },
      ],
    });

    if (referencingActivity) {
      return NextResponse.json(
        {
          error: `Cannot delete asset: It is currently used as cover or media by activity "${referencingActivity.title}". Please change or remove the activity image first.`,
        },
        { status: 400 }
      );
    }

    // 1. Delete from Cloudinary
    try {
      await deleteFromCloudinary(asset.publicId);
    } catch (cErr) {
      console.warn('Cloudinary destroy warning (continuing with DB deletion):', cErr);
    }

    // 2. Delete from MongoDB
    await assetsCollection.deleteOne({ _id: asset._id });

    logAdminAction('delete_asset', request, {
      publicId: asset.publicId,
      name: asset.name,
    }).catch(() => {});

    return NextResponse.json({ ok: true, message: 'Asset deleted successfully' });
  } catch (err) {
    console.error('Delete asset error:', err);
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
  }
}
