import { db } from '../../utils/db';
import { categories } from '../../database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event);

  const userCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId))
    .orderBy(categories.createdAt);

  return userCategories;
});
