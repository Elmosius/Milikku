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

  const existingItem = await db.query.items.findFirst({
    where: and(eq(items.id, id), eq(items.userId, userId)),
  });
  if (!existingItem) {
    throw createError({ statusCode: 404, statusMessage: 'Item not found' });
  }

  const parts = await readMultipartFormData(event);
  if (!parts) {
    throw createError({ statusCode: 400, statusMessage: 'No multipart data found' });
  }

  const filePart = parts.find((p) => p.name === 'photo');
  if (!filePart || !filePart.data || !filePart.filename) {
    throw createError({ statusCode: 400, statusMessage: 'Photo file is required' });
  }

  const mimeType = filePart.type || 'image/jpeg';
  if (!mimeType.startsWith('image/')) {
    throw createError({ statusCode: 400, statusMessage: 'File must be an image' });
  }

  if (filePart.data.length > 5 * 1024 * 1024) {
    throw createError({ statusCode: 400, statusMessage: 'File size must be less than 5MB' });
  }

  const supabase = await serverSupabaseClient(event);

  try {
    if (existingItem.photoUrl) {
      const url = new URL(existingItem.photoUrl);
      const pathParts = url.pathname.split('/item-photos/');
      const storagePath = pathParts[1];
      if (storagePath) {
        await supabase.storage.from('item-photos').remove([storagePath]);
      }
    }

    const ext = filePart.filename.split('.').pop() || 'jpg';
    const fileName = `${userId}/${id}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('item-photos')
      .upload(fileName, filePart.data, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw createError({ statusCode: 500, statusMessage: 'Failed to upload photo. Please try again later.' });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('item-photos').getPublicUrl(fileName);

    const [updatedItem] = await db
      .update(items)
      .set({ photoUrl: publicUrl, updatedAt: new Date() })
      .where(and(eq(items.id, id), eq(items.userId, userId)))
      .returning();

    return { photoUrl: updatedItem.photoUrl };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error('Photo upload processing error:', error);
    throw createError({ statusCode: 500, statusMessage: 'Failed to upload photo. Please try again later.' });
  }
});
