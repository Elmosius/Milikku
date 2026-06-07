<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { Button } from '~/components/ui/button';

defineEmits<{
  (e: 'create'): void;
}>();
</script>

<template>
  <div class="flex items-center justify-between">
    <h1 class="text-foreground text-2xl font-bold tracking-tight">Locations</h1>
    <Button @click="$emit('create')">
      <Plus class="mr-2 h-4 w-4" stroke-width="1.5" /> Add Location
    </Button>
  </div>
</template>
