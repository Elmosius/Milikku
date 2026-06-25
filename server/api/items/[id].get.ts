import { and, eq } from 'drizzle-orm';
import { items } from '../../database/schema';
import { db } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event);
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Item ID is required' });
  }

  const [item] = await db
    .select()
    .from(items)
    .where(and(eq(items.id, id), eq(items.userId, userId)))
    .limit(1);

  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'Item not found' });
  }

  return item;
});
