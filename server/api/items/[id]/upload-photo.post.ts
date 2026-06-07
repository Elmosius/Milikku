import { db } from '../../../utils/db';
import { items } from '../../../database/schema';
import { eq, and } from 'drizzle-orm';
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event);

  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Item ID is required' });
  }

  // Verify item ownership
  const existingItem = await db.query.items.findFirst({
    where: and(eq(items.id, id), eq(items.userId, userId)),
  });
  if (!existingItem) {
    throw createError({ statusCode: 404, statusMessage: 'Item not found' });
  }

  // Read multipart form data
  const parts = await readMultipartFormData(event);
  if (!parts) {
    throw createError({ statusCode: 400, statusMessage: 'No multipart data found' });
  }

  const filePart = parts.find((p) => p.name === 'photo');
  if (!filePart || !filePart.data || !filePart.filename) {
    throw createError({ statusCode: 400, statusMessage: 'Photo file is required' });
  }

  // Validate file type
  const mimeType = filePart.type || 'image/jpeg';
  if (!mimeType.startsWith('image/')) {
    throw createError({ statusCode: 400, statusMessage: 'File must be an image' });
  }

  // Validate file size (max 5MB)
  if (filePart.data.length > 5 * 1024 * 1024) {
    throw createError({ statusCode: 400, statusMessage: 'File size must be less than 5MB' });
  }

  const supabase = await serverSupabaseClient(event);

  try {
    // Delete old photo if exists
    if (existingItem.photoUrl) {
      const url = new URL(existingItem.photoUrl);
      const pathParts = url.pathname.split('/item-photos/');
      if (pathParts.length > 1) {
        await supabase.storage.from('item-photos').remove([pathParts[1]]);
      }
    }

    // Generate unique filename: userId/itemId-timestamp.ext
    const ext = filePart.filename.split('.').pop() || 'jpg';
    const fileName = `${userId}/${id}-${Date.now()}.${ext}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('item-photos')
      .upload(fileName, filePart.data, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      throw createError({ statusCode: 500, statusMessage: uploadError.message });
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('item-photos').getPublicUrl(fileName);

    // Update item's photoUrl in database
    const [updatedItem] = await db
      .update(items)
      .set({ photoUrl: publicUrl, updatedAt: new Date() })
      .where(and(eq(items.id, id), eq(items.userId, userId)))
      .returning();

    return { photoUrl: updatedItem.photoUrl };
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({ statusCode: 500, statusMessage: error.message || 'Upload failed' });
  }
});
