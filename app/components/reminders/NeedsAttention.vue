<script setup lang="ts">
import { ArrowRight, Bell } from 'lucide-vue-next';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import ReminderListItem from './ReminderListItem.vue';

const { activeReminders, pending, openReminder } = useReminders();
const visibleReminders = computed(() => activeReminders.value.slice(0, 5));
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0">
      <div>
        <CardTitle class="text-base">Needs Attention</CardTitle>
        <p class="text-muted-foreground mt-1 text-xs">Garansi dan peminjaman yang perlu ditindaklanjuti</p>
      </div>
      <Button variant="ghost" size="sm" as-child>
        <NuxtLink to="/notifications">
          Lihat semua
          <ArrowRight class="ml-1.5 h-3.5 w-3.5" />
        </NuxtLink>
      </Button>
    </CardHeader>
    <CardContent class="px-0 pb-0">
      <div v-if="pending && visibleReminders.length === 0" class="text-muted-foreground px-6 pb-6 text-sm">
        Memuat reminder...
      </div>
      <div v-else-if="visibleReminders.length === 0" class="px-6 pb-6 text-center">
        <Bell class="text-muted-foreground mx-auto mb-2 h-8 w-8" />
        <p class="text-sm font-medium">Tidak ada yang perlu diperhatikan</p>
      </div>
      <div v-else class="divide-y border-t">
        <ReminderListItem
          v-for="reminder in visibleReminders"
          :key="reminder.key"
          :reminder="reminder"
          compact
          @open="openReminder"
        />
      </div>
    </CardContent>
  </Card>
</template>
