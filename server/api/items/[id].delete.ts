import { db } from '../../utils/db';
import { items } from '../../database/schema';
import { eq, and } from 'drizzle-orm';
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event);

  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Item ID is required' });
  }

  // Find the item first to get its photoUrl for storage cleanup
  const existingItem = await db.query.items.findFirst({
    where: and(eq(items.id, id), eq(items.userId, userId)),
  });

  if (!existingItem) {
    throw createError({ statusCode: 404, statusMessage: 'Item not found' });
  }

  // Delete from database first
  const [deletedItem] = await db
    .delete(items)
    .where(and(eq(items.id, id), eq(items.userId, userId)))
    .returning();

  if (!deletedItem) {
    throw createError({ statusCode: 404, statusMessage: 'Item not found' });
  }

  // Clean up photo from Supabase Storage if exists
  if (existingItem.photoUrl) {
    try {
      const supabase = await serverSupabaseClient(event);
      // Extract path from URL: userId/filename
      const url = new URL(existingItem.photoUrl);
      const pathParts = url.pathname.split('/item-photos/');
      const storagePath = pathParts[1];
      if (storagePath) {
        await supabase.storage.from('item-photos').remove([storagePath]);
      }
    } catch {
      // Non-critical — item is already deleted from DB
    }
  }

  return { success: true, message: 'Item deleted successfully' };
});
