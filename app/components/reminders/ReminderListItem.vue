<script setup lang="ts">
import {
  BellRing,
  Check,
  Circle,
  HandCoins,
  ShieldAlert,
  X,
} from 'lucide-vue-next';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import type { Reminder } from '~/types/reminder';
import { formatDate } from '~/utils/date';

defineProps<{
  reminder: Reminder;
  compact?: boolean;
  showActions?: boolean;
}>();

const emit = defineEmits<{
  open: [reminder: Reminder];
  toggleRead: [reminder: Reminder];
  dismiss: [reminder: Reminder];
}>();
</script>

<template>
  <div
    class="group flex min-w-0 gap-3 px-3 py-3"
    :class="[
      compact ? 'items-start' : 'items-center',
      !reminder.isRead && !reminder.isDismissed ? 'bg-muted/45' : '',
    ]"
  >
    <div
      class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border"
      :class="{
        'border-destructive/30 bg-destructive/10 text-destructive':
          reminder.severity === 'critical',
        'border-primary/30 bg-primary/10 text-primary':
          reminder.severity === 'warning',
        'border-border bg-muted text-muted-foreground':
          reminder.severity === 'info',
      }"
    >
      <ShieldAlert v-if="reminder.type === 'warranty'" class="h-4 w-4" />
      <HandCoins v-else class="h-4 w-4" />
    </div>

    <button
      type="button"
      class="min-w-0 flex-1 text-left focus-visible:outline-none"
      @click="emit('open', reminder)"
    >
      <div class="flex min-w-0 items-center gap-2">
        <Circle
          v-if="!reminder.isRead && !reminder.isDismissed"
          class="fill-primary text-primary h-2 w-2 shrink-0"
        />
        <p class="truncate text-sm font-semibold">{{ reminder.title }}</p>
      </div>
      <p class="text-muted-foreground mt-1 text-xs leading-relaxed">
        {{ reminder.message }}
      </p>
      <div class="mt-2 flex flex-wrap items-center gap-2">
        <Badge variant="outline" class="text-muted-foreground bg-background text-[10px]">
          {{ reminder.type === 'warranty' ? 'Garansi' : 'Peminjaman' }}
        </Badge>
        <span class="text-muted-foreground text-[11px]">
          {{ formatDate(reminder.dueDate) }}
        </span>
      </div>
    </button>

    <div v-if="showActions" class="flex shrink-0 items-center gap-1">
      <Button
        v-if="!reminder.isDismissed"
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        :title="reminder.isRead ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'"
        @click="emit('toggleRead', reminder)"
      >
        <BellRing v-if="reminder.isRead" class="h-4 w-4" />
        <Check v-else class="h-4 w-4" />
      </Button>
      <Button
        v-if="!reminder.isDismissed"
        variant="ghost"
        size="icon"
        class="text-muted-foreground h-8 w-8"
        title="Tutup reminder"
        @click="emit('dismiss', reminder)"
      >
        <X class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
