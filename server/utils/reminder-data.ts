import { and, eq, isNotNull, isNull } from 'drizzle-orm';
import { items, lendings, reminderStates } from '../database/schema';
import { db } from './db';
import { buildReminders } from './reminders';

export const getRemindersForUser = async (userId: string) => {
  const [warrantyItems, activeLendings, states] = await Promise.all([
    db
      .select({
        id: items.id,
        name: items.name,
        warrantyExpiry: items.warrantyExpiry,
      })
      .from(items)
      .where(and(eq(items.userId, userId), isNotNull(items.warrantyExpiry))),
    db
      .select({
        id: lendings.id,
        borrowerName: lendings.borrowerName,
        expectedReturnAt: lendings.expectedReturnAt,
        returnedAt: lendings.returnedAt,
        itemName: items.name,
      })
      .from(lendings)
      .leftJoin(items, eq(lendings.itemId, items.id))
      .where(
        and(
          eq(lendings.userId, userId),
          isNotNull(lendings.expectedReturnAt),
          isNull(lendings.returnedAt),
        ),
      ),
    db
      .select({
        reminderKey: reminderStates.reminderKey,
        readAt: reminderStates.readAt,
        dismissedAt: reminderStates.dismissedAt,
      })
      .from(reminderStates)
      .where(eq(reminderStates.userId, userId)),
  ]);

  return buildReminders({
    items: warrantyItems,
    lendings: activeLendings,
    states,
  });
};
