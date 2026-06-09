import { db } from '../../utils/db';
import { lendings, items } from '../../database/schema';
import { eq, and, isNull, desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event);
  const query = getQuery(event);
  const itemId = query.itemId as string | undefined;
  const status = query.status as string | undefined;

  const filters: any[] = [eq(lendings.userId, userId)];

  if (itemId) {
    filters.push(eq(lendings.itemId, itemId));
  }

  if (status === 'active') {
    filters.push(isNull(lendings.returnedAt));
  } else if (status === 'returned') {
    filters.push(lendings.returnedAt);
  }

  try {
    const userLendings = await db
      .select({
        id: lendings.id,
        userId: lendings.userId,
        itemId: lendings.itemId,
        borrowerName: lendings.borrowerName,
        borrowerContact: lendings.borrowerContact,
        lentAt: lendings.lentAt,
        expectedReturnAt: lendings.expectedReturnAt,
        returnedAt: lendings.returnedAt,
        notes: lendings.notes,
        createdAt: lendings.createdAt,
        updatedAt: lendings.updatedAt,
        itemName: items.name,
        itemPhotoUrl: items.photoUrl,
      })
      .from(lendings)
      .leftJoin(items, eq(lendings.itemId, items.id))
      .where(and(...filters))
      .orderBy(desc(lendings.createdAt));

    return userLendings.map((l) => ({
      ...l,
      item: {
        id: l.itemId,
        name: l.itemName,
        photoUrl: l.itemPhotoUrl,
      },
    }));
  } catch (error: any) {
    console.error('List lendings error:', error);
    throw createError({ statusCode: 500, statusMessage: 'Failed to load lending data.' });
  }
});
