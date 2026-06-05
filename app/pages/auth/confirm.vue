<script setup lang="ts">
import { watchEffect } from 'vue';
import { Loader2 } from 'lucide-vue-next';

definePageMeta({
  layout: false,
});

const user = useSupabaseUser();

watchEffect(() => {
  if (user.value) {
    navigateTo('/');
  }
});
</script>

<template>
  <div class="bg-background flex min-h-svh flex-col items-center justify-center p-4">
    <div class="flex flex-col items-center gap-4 text-center">
      <Loader2 class="text-primary h-8 w-8 animate-spin" />
      <p class="text-foreground text-sm font-medium">Memverifikasi login...</p>
      <p class="text-muted-foreground text-xs">Tunggu sebentar, kamu sedang diarahkan.</p>
    </div>
  </div>
</template>
