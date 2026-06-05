import { serverSupabaseUser } from '#supabase/server';
import { db } from '../../utils/db';
import { categories } from '../../database/schema';
import { eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  
  const userId = (user as any)?.id || user?.sub;
  
  if (!user || !userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category ID is required',
    });
  }

  const [deletedCategory] = await db
    .delete(categories)
    .where(and(eq(categories.id, id), eq(categories.userId, userId)))
    .returning();

  if (!deletedCategory) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Category not found',
    });
  }
    
  return { success: true, message: 'Category deleted successfully' };
});
