import type { ReminderStatus } from '~/types/reminder';
import { getRemindersForUser } from '../../utils/reminder-data';

const validStatuses = new Set<ReminderStatus>(['all', 'active', 'unread', 'dismissed']);

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event);
  const query = getQuery(event);
  const requestedStatus = String(query.status || 'active') as ReminderStatus;
  const status = validStatuses.has(requestedStatus) ? requestedStatus : 'active';
  const limit = Math.max(1, Math.min(100, Number(query.limit) || 100));

  const allReminders = await getRemindersForUser(userId);
  const active = allReminders.filter((reminder) => !reminder.isDismissed);
  const unread = active.filter((reminder) => !reminder.isRead);
  const dismissed = allReminders.filter((reminder) => reminder.isDismissed);

  const reminders =
    status === 'all'
      ? allReminders
      : status === 'unread'
        ? unread
        : status === 'dismissed'
          ? dismissed
          : active;

  return {
    reminders: reminders.slice(0, limit),
    counts: {
      active: active.length,
      unread: unread.length,
      dismissed: dismissed.length,
    },
  };
});
