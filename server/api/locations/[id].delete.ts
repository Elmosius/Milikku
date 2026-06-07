import { db } from '../../utils/db';
import { locations } from '../../database/schema';
import { eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event);

  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Location ID is required',
    });
  }

  const [deletedLocation] = await db
    .delete(locations)
    .where(and(eq(locations.id, id), eq(locations.userId, userId)))
    .returning();

  if (!deletedLocation) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Location not found',
    });
  }

  return { success: true, message: 'Location deleted successfully' };
});
