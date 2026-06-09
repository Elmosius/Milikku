import { db } from '../../utils/db';
import { lendings, items } from '../../database/schema';
import { eq, and, isNull } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event);
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Lending ID is required' });
  }

  const body = await readBody(event);

  const existingLending = await db.query.lendings.findFirst({
    where: and(eq(lendings.id, id), eq(lendings.userId, userId)),
  });
  if (!existingLending) {
    throw createError({ statusCode: 404, statusMessage: 'Lending record not found' });
  }

  try {
    const updateData: Record<string, any> = { updatedAt: new Date() };

    if (body.borrowerName !== undefined) updateData.borrowerName = body.borrowerName;
    if (body.borrowerContact !== undefined) updateData.borrowerContact = body.borrowerContact;
    if (body.lentAt !== undefined) updateData.lentAt = body.lentAt;
    if (body.expectedReturnAt !== undefined) updateData.expectedReturnAt = body.expectedReturnAt;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.returnedAt !== undefined) updateData.returnedAt = body.returnedAt;

    const [updatedLending] = await db
      .update(lendings)
      .set(updateData)
      .where(and(eq(lendings.id, id), eq(lendings.userId, userId)))
      .returning();

    if (body.returnedAt) {
      const otherActiveLendings = await db.query.lendings.findFirst({
        where: and(
          eq(lendings.itemId, existingLending.itemId),
          eq(lendings.userId, userId),
          isNull(lendings.returnedAt),
        ),
      });

      if (!otherActiveLendings || otherActiveLendings.id === id) {
        await db
          .update(items)
          .set({ status: 'Tersedia', updatedAt: new Date() })
          .where(eq(items.id, existingLending.itemId));
      }
    }

    return updatedLending;
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error('Update lending error:', error);
    throw createError({ statusCode: 500, statusMessage: 'Failed to update lending data.' });
  }
});
