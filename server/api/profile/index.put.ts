import { db } from '../../utils/db';
import { profiles } from '../../database/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const profileSchema = z.object({
  fullName: z.string().optional().or(z.literal('')),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event);
  const body = await readValidatedBody(event, (b) => profileSchema.parse(b));

  const existingProfile = await db.query.profiles.findFirst({
    where: eq(profiles.id, userId),
  });

  let updatedProfile;

  if (!existingProfile) {
    [updatedProfile] = await db.insert(profiles).values({
      id: userId,
      fullName: body.fullName || '',
      avatarUrl: body.avatarUrl || null,
    }).returning();
  } else {
    [updatedProfile] = await db
      .update(profiles)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, userId))
      .returning();
  }

  return updatedProfile;
});
