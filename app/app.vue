<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/composables/useAuth';
import { Loader2 } from 'lucide-vue-next';

const { isLoading } = useAuth();
</script>

<template>
  <div>
    <VitePwaManifest />
    <div
      v-if="isLoading"
      class="bg-background relative flex min-h-svh flex-col items-center justify-center overflow-hidden p-4"
    >
      <div
        class="bg-primary/5 pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full blur-3xl"
      />
      <div
        class="bg-accent/5 pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full blur-3xl"
      />

      <div class="relative z-10 flex flex-col items-center gap-4 text-center">
        <div class="relative flex h-16 w-16 items-center justify-center">
          <img src="/logo.svg" alt="Milikku Logo" class="h-12 w-auto animate-pulse" />
          <Loader2 class="text-primary absolute h-16 w-16 animate-spin stroke-[1.5]" />
        </div>
        <p class="text-foreground mt-4 text-sm font-semibold tracking-wide">Memuat halaman...</p>
      </div>
    </div>

    <template v-else>
      <Toaster position="top-right" rich-colors />
      <NuxtRouteAnnouncer />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </template>
  </div>
</template>
