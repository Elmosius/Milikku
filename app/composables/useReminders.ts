import { toast } from 'vue-sonner';
import type {
  Reminder,
  ReminderAction,
  ReminderResponse,
  ReminderStatus,
} from '~/types/reminder';

let refreshPromise: Promise<void> | null = null;
let pollingStarted = false;

const emptyResponse = (): ReminderResponse => ({
  reminders: [],
  counts: {
    active: 0,
    unread: 0,
    dismissed: 0,
  },
});

export function useReminders() {
  const data = useState<ReminderResponse>('reminder-center-data', emptyResponse);
  const pending = useState('reminder-center-pending', () => false);
  const initialized = useState('reminder-center-initialized', () => false);

  const refresh = async () => {
    if (refreshPromise) return refreshPromise;

    pending.value = true;
    refreshPromise = $fetch<ReminderResponse>('/api/reminders', {
      query: { status: 'all' satisfies ReminderStatus },
    })
      .then((response) => {
        data.value = response;
        initialized.value = true;
      })
      .catch((error: any) => {
        if (error?.statusCode !== 401) {
          toast.error(error?.data?.statusMessage || 'Gagal memuat reminder');
        }
      })
      .finally(() => {
        pending.value = false;
        refreshPromise = null;
      });

    return refreshPromise;
  };

  const startPolling = () => {
    if (!import.meta.client || pollingStarted) return;
    pollingStarted = true;

    window.setInterval(() => {
      void refresh();
    }, 60_000);

    window.addEventListener('focus', () => {
      void refresh();
    });
  };

  onMounted(() => {
    if (!initialized.value) void refresh();
    startPolling();
  });

  const activeReminders = computed(() =>
    data.value.reminders.filter((reminder) => !reminder.isDismissed),
  );
  const unreadReminders = computed(() =>
    activeReminders.value.filter((reminder) => !reminder.isRead),
  );
  const dismissedReminders = computed(() =>
    data.value.reminders.filter((reminder) => reminder.isDismissed),
  );

  const updateState = async (reminder: Reminder, action: ReminderAction) => {
    try {
      await $fetch('/api/reminders/state', {
        method: 'PATCH',
        body: {
          reminderKey: reminder.key,
          action,
        },
      });
      await refresh();
    } catch (error: any) {
      toast.error(error?.data?.statusMessage || 'Gagal memperbarui reminder');
      throw error;
    }
  };

  const openReminder = async (reminder: Reminder) => {
    if (!reminder.isRead) {
      await updateState(reminder, 'read');
    }
    await navigateTo(reminder.href);
  };

  const markAllRead = async () => {
    try {
      await $fetch('/api/reminders/read-all', { method: 'POST' });
      await refresh();
      toast.success('Semua reminder ditandai sudah dibaca');
    } catch (error: any) {
      toast.error(error?.data?.statusMessage || 'Gagal menandai semua reminder');
    }
  };

  return {
    data,
    pending,
    activeReminders,
    unreadReminders,
    dismissedReminders,
    counts: computed(() => data.value.counts),
    refresh,
    updateState,
    openReminder,
    markAllRead,
  };
}
