<script setup lang="ts">
import { Button } from '~/components/ui/button';
import { PlusIcon } from 'lucide-vue-next';

defineEmits<{
  create: [];
}>();
</script>

<template>
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-3xl font-bold tracking-tight">Items</h1>
    <Button @click="$emit('create')">
      <PlusIcon class="mr-2 h-4 w-4" />
      Add Item
    </Button>
  </div>
</template>
