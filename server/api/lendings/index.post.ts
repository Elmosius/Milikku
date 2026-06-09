import { db } from '../../utils/db';
import { lendings, items } from '../../database/schema';
import { eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event);
  const body = await readBody(event);

  if (!body.itemId) {
    throw createError({ statusCode: 400, statusMessage: 'Item is required' });
  }
  if (!body.borrowerName) {
    throw createError({ statusCode: 400, statusMessage: 'Borrower name is required' });
  }
  if (!body.lentAt) {
    throw createError({ statusCode: 400, statusMessage: 'Lent date is required' });
  }

  const existingItem = await db.query.items.findFirst({
    where: and(eq(items.id, body.itemId), eq(items.userId, userId)),
  });
  if (!existingItem) {
    throw createError({ statusCode: 404, statusMessage: 'Item not found' });
  }

  try {
    const [newLending] = await db
      .insert(lendings)
      .values({
        userId,
        itemId: body.itemId,
        borrowerName: body.borrowerName,
        borrowerContact: body.borrowerContact || null,
        lentAt: body.lentAt,
        expectedReturnAt: body.expectedReturnAt || null,
        notes: body.notes || null,
      })
      .returning();

    await db
      .update(items)
      .set({ status: 'Dipinjamkan', updatedAt: new Date() })
      .where(eq(items.id, body.itemId));

    return newLending;
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error('Create lending error:', error);
    throw createError({ statusCode: 500, statusMessage: 'Failed to save lending data.' });
  }
});
