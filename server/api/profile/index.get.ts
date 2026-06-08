import { db } from '../../utils/db';
import { profiles } from '../../database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event);

  let userProfile = await db.query.profiles.findFirst({
    where: eq(profiles.id, userId),
  });

  if (!userProfile) {
    const [newProfile] = await db.insert(profiles).values({
      id: userId,
      fullName: '',
    }).returning();
    userProfile = newProfile;
  }

  return userProfile;
});
