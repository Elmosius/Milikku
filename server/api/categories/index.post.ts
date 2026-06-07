import { db } from '../../utils/db';
import { categories, profiles } from '../../database/schema';
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

    const [newCategory] = await db
      .insert(categories)
      .values({
        userId: userId,
        name: body.name,
        icon: body.icon || null,
        color: body.color || null,
      })
      .returning();

    return newCategory;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Database error occurred',
    });
  }
});
