<script setup lang="ts">
import { Bell, CheckCheck } from 'lucide-vue-next';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import ReminderListItem from '~/components/reminders/ReminderListItem.vue';
import type { Reminder, ReminderAction } from '~/types/reminder';

const {
  activeReminders,
  unreadReminders,
  dismissedReminders,
  counts,
  pending,
  openReminder,
  updateState,
  markAllRead,
} = useReminders();

const activeTab = ref('active');

const toggleRead = (reminder: Reminder) =>
  updateState(reminder, reminder.isRead ? 'unread' : 'read');

const dismiss = (reminder: Reminder) => updateState(reminder, 'dismiss' satisfies ReminderAction);
</script>

<template>
  <div class="flex flex-1 flex-col gap-5">
    <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Reminder Center</h1>
        <p class="text-muted-foreground text-sm">
          Pantau masa garansi dan jadwal pengembalian barang.
        </p>
      </div>
      <Button v-if="counts.unread > 0" variant="outline" @click="markAllRead">
        <CheckCheck class="mr-2 h-4 w-4" />
        Tandai semua sudah dibaca
      </Button>
    </div>

    <Tabs v-model="activeTab" class="w-full">
      <TabsList class="grid w-full max-w-lg grid-cols-3">
        <TabsTrigger value="active">Aktif ({{ counts.active }})</TabsTrigger>
        <TabsTrigger value="unread">Belum dibaca ({{ counts.unread }})</TabsTrigger>
        <TabsTrigger value="dismissed">Ditutup ({{ counts.dismissed }})</TabsTrigger>
      </TabsList>

      <TabsContent
        v-for="tab in [
          { value: 'active', reminders: activeReminders },
          { value: 'unread', reminders: unreadReminders },
          { value: 'dismissed', reminders: dismissedReminders },
        ]"
        :key="tab.value"
        :value="tab.value"
        class="mt-4"
      >
        <div class="bg-card overflow-hidden rounded-md border">
          <div v-if="pending && tab.reminders.length === 0" class="text-muted-foreground p-10 text-center text-sm">
            Memuat reminder...
          </div>
          <div v-else-if="tab.reminders.length === 0" class="p-10 text-center">
            <Bell class="text-muted-foreground mx-auto mb-3 h-10 w-10" />
            <p class="font-medium text-sm">Belum ada reminder di sini</p>
          </div>
          <div v-else class="divide-y">
            <ReminderListItem
              v-for="reminder in tab.reminders"
              :key="reminder.key"
              :reminder="reminder"
              show-actions
              @open="openReminder"
              @toggle-read="toggleRead"
              @dismiss="dismiss"
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
