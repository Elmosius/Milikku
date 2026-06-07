import { db } from '../../utils/db';
import { items } from '../../database/schema';
import { eq, desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event);

  const userItems = await db
    .select()
    .from(items)
    .where(eq(items.userId, userId))
    .orderBy(desc(items.createdAt));

  return userItems;
});
