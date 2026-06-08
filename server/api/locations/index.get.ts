import { db } from '../../utils/db';
import { locations, items } from '../../database/schema';
import { eq, sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event);

  const userLocations = await db
    .select({
      id: locations.id,
      userId: locations.userId,
      name: locations.name,
      description: locations.description,
      icon: locations.icon,
      createdAt: locations.createdAt,
      updatedAt: locations.updatedAt,
      itemCount: sql<number>`coalesce(sum(${items.quantity}), 0)`.mapWith(Number),
    })
    .from(locations)
    .leftJoin(items, eq(locations.id, items.locationId))
    .where(eq(locations.userId, userId))
    .groupBy(locations.id)
    .orderBy(locations.createdAt);

  return userLocations;
});
