import { db } from '../../utils/db';
import { locations, profiles } from '../../database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const { userId, user } = await getAuthenticatedUser(event);

  const body = await readBody(event);

  if (!body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name is required',
    });
  }

  try {
    // Ensure profile exists to satisfy foreign key constraints
    const existingProfile = await db.query.profiles.findFirst({
      where: eq(profiles.id, userId),
    });

    if (!existingProfile) {
      await db.insert(profiles).values({
        id: userId,
        fullName: user.user_metadata?.full_name || user.email || 'User',
      });
    }

    const [newLocation] = await db
      .insert(locations)
      .values({
        userId: userId,
        name: body.name,
        description: body.description || null,
        icon: body.icon || null,
      })
      .returning();

    return newLocation;
  } catch (error: any) {
    console.error('Create location error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process location data. Please try again.',
    });
  }
});
