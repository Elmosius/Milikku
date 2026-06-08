import { db } from '../../utils/db';
import { categories, items } from '../../database/schema';
import { eq, sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event);

  const userCategories = await db
    .select({
      id: categories.id,
      userId: categories.userId,
      name: categories.name,
      icon: categories.icon,
      color: categories.color,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt,
      itemCount: sql<number>`coalesce(sum(${items.quantity}), 0)`.mapWith(Number),
    })
    .from(categories)
    .leftJoin(items, eq(categories.id, items.categoryId))
    .where(eq(categories.userId, userId))
    .groupBy(categories.id)
    .orderBy(categories.createdAt);

  return userCategories;
});
