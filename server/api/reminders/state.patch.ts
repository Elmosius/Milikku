import { z } from 'zod';
import { reminderStates } from '../../database/schema';
import { getRemindersForUser } from '../../utils/reminder-data';
import { db } from '../../utils/db';

const reminderStateSchema = z.object({
  reminderKey: z.string().min(1).max(255),
  action: z.enum(['read', 'unread', 'dismiss']),
});

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event);
  const parsed = reminderStateSchema.safeParse(await readBody(event));

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid reminder action' });
  }

  const { reminderKey, action } = parsed.data;
  const reminders = await getRemindersForUser(userId);
  const reminder = reminders.find((candidate) => candidate.key === reminderKey);

  if (!reminder) {
    throw createError({ statusCode: 404, statusMessage: 'Reminder not found' });
  }

  const now = new Date();
  const values =
    action === 'dismiss'
      ? { readAt: now, dismissedAt: now, updatedAt: now }
      : action === 'read'
        ? { readAt: now, updatedAt: now }
        : { readAt: null, updatedAt: now };

  await db
    .insert(reminderStates)
    .values({
      userId,
      reminderKey,
      ...values,
    })
    .onConflictDoUpdate({
      target: [reminderStates.userId, reminderStates.reminderKey],
      set: values,
    });

  return { success: true };
});
