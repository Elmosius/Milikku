import { db } from '../../utils/db';
import { profiles } from '../../database/schema';
import { eq } from 'drizzle-orm';
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event);

  const parts = await readMultipartFormData(event);
  if (!parts) {
    throw createError({ statusCode: 400, statusMessage: 'No multipart data found' });
  }

  const filePart = parts.find((p) => p.name === 'avatar');
  if (!filePart || !filePart.data || !filePart.filename) {
    throw createError({ statusCode: 400, statusMessage: 'Avatar file is required' });
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
    const existingProfile = await db.query.profiles.findFirst({
      where: eq(profiles.id, userId),
    });

    if (existingProfile?.avatarUrl) {
      try {
        const url = new URL(existingProfile.avatarUrl);
        const pathParts = url.pathname.split('/item-photos/');
        const fileToRemove = pathParts[1];
        if (fileToRemove && fileToRemove.includes('avatar-')) {
          await supabase.storage.from('item-photos').remove([fileToRemove]);
        }
      } catch (e) {
        // Ignore parsing errors for old avatars
      }
    }

    const ext = filePart.filename.split('.').pop() || 'jpg';
    const fileName = `${userId}/avatar-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('item-photos')
      .upload(fileName, filePart.data, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      throw createError({ statusCode: 500, statusMessage: uploadError.message });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('item-photos').getPublicUrl(fileName);

    let updatedProfile;

    if (!existingProfile) {
      [updatedProfile] = await db.insert(profiles).values({
        id: userId,
        avatarUrl: publicUrl,
      }).returning();
    } else {
      [updatedProfile] = await db
        .update(profiles)
        .set({ avatarUrl: publicUrl, updatedAt: new Date() })
        .where(eq(profiles.id, userId))
        .returning();
    }

    return { avatarUrl: updatedProfile.avatarUrl };
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({ statusCode: 500, statusMessage: error.message || 'Upload failed' });
  }
});
