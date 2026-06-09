import { db } from '../../utils/db';
import { lendings } from '../../database/schema';
import { eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event);
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Lending ID is required' });
  }

  const existingLending = await db.query.lendings.findFirst({
    where: and(eq(lendings.id, id), eq(lendings.userId, userId)),
  });
  if (!existingLending) {
    throw createError({ statusCode: 404, statusMessage: 'Lending record not found' });
  }

  try {
    await db
      .delete(lendings)
      .where(and(eq(lendings.id, id), eq(lendings.userId, userId)));

    return { success: true };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error('Delete lending error:', error);
    throw createError({ statusCode: 500, statusMessage: 'Failed to delete lending record.' });
  }
});
