import { reminderStates } from '../../database/schema';
import { getRemindersForUser } from '../../utils/reminder-data';
import { db } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event);
  const reminders = (await getRemindersForUser(userId)).filter(
    (reminder) => !reminder.isDismissed && !reminder.isRead,
  );
  const now = new Date();

  if (reminders.length === 0) return { updated: 0 };

  await db
    .insert(reminderStates)
    .values(
      reminders.map((reminder) => ({
        userId,
        reminderKey: reminder.key,
        readAt: now,
        updatedAt: now,
      })),
    )
    .onConflictDoUpdate({
      target: [reminderStates.userId, reminderStates.reminderKey],
      set: { readAt: now, updatedAt: now },
    });

  return { updated: reminders.length };
});
