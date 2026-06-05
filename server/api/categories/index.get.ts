import { serverSupabaseUser } from '#supabase/server';
import { db } from '../../utils/db';
import { categories } from '../../database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  
  const userId = (user as any)?.id || user?.sub;
  
  if (!user || !userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  const userCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId))
    .orderBy(categories.createdAt);
    
  return userCategories;
});
