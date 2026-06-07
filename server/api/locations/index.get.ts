import { db } from '../../utils/db';
import { locations } from '../../database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event);

  const userLocations = await db
    .select()
    .from(locations)
    .where(eq(locations.userId, userId))
    .orderBy(locations.createdAt);

  return userLocations;
});
