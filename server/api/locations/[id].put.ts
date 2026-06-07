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

  const body = await readBody(event);

  const updateData: Partial<typeof locations.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (body.name !== undefined) updateData.name = body.name;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.icon !== undefined) updateData.icon = body.icon;

  const [updatedLocation] = await db
    .update(locations)
    .set(updateData)
    .where(and(eq(locations.id, id), eq(locations.userId, userId)))
    .returning();

  if (!updatedLocation) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Location not found',
    });
  }

  return updatedLocation;
});
