<script setup lang="ts">
import { Bell, CheckCheck } from 'lucide-vue-next';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Separator } from '~/components/ui/separator';
import ReminderListItem from './ReminderListItem.vue';

const { activeReminders, counts, pending, openReminder, markAllRead } = useReminders();
const topReminders = computed(() => activeReminders.value.slice(0, 5));
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" class="relative" title="Reminder">
        <Bell class="h-4 w-4" />
        <span
          v-if="counts.unread > 0"
          class="bg-primary text-primary-foreground absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold"
        >
          {{ counts.unread > 99 ? '99+' : counts.unread }}
        </span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[min(24rem,calc(100vw-2rem))] p-0">
      <div class="flex h-12 items-center justify-between px-3">
        <div>
          <p class="text-sm font-semibold">Reminder</p>
          <p class="text-muted-foreground text-[11px]">{{ counts.unread }} belum dibaca</p>
        </div>
        <Button
          v-if="counts.unread > 0"
          variant="ghost"
          size="sm"
          class="h-8 text-xs"
          @click="markAllRead"
        >
          <CheckCheck class="mr-1.5 h-3.5 w-3.5" />
          Tandai semua
        </Button>
      </div>
      <Separator />

      <div v-if="pending && topReminders.length === 0" class="text-muted-foreground p-6 text-center text-sm">
        Memuat reminder...
      </div>
      <div v-else-if="topReminders.length === 0" class="p-6 text-center">
        <Bell class="text-muted-foreground mx-auto mb-2 h-8 w-8" />
        <p class="text-sm font-medium">Tidak ada reminder aktif</p>
        <p class="text-muted-foreground mt-1 text-xs">Semua barangmu sedang aman.</p>
      </div>
      <div v-else class="max-h-96 divide-y overflow-y-auto">
        <ReminderListItem
          v-for="reminder in topReminders"
          :key="reminder.key"
          :reminder="reminder"
          compact
          @open="openReminder"
        />
      </div>

      <Separator />
      <NuxtLink
        to="/notifications"
        class="hover:bg-muted flex h-10 items-center justify-center text-xs font-medium transition-colors"
      >
        Lihat semua reminder
      </NuxtLink>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
