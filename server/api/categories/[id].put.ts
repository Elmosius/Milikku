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

  const body = await readBody(event);
  
  const updateData: Partial<typeof categories.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (body.name !== undefined) updateData.name = body.name;
  if (body.icon !== undefined) updateData.icon = body.icon;
  if (body.color !== undefined) updateData.color = body.color;

  const [updatedCategory] = await db
    .update(categories)
    .set(updateData)
    .where(and(eq(categories.id, id), eq(categories.userId, userId)))
    .returning();

  if (!updatedCategory) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Category not found',
    });
  }
    
  return updatedCategory;
});
