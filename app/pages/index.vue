<script setup lang="ts">
import { Loader2, LogOut } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { getFriendlyErrorMessage } from '@/utils/error';
import { useAuth } from '@/composables/useAuth';

const { user, signOut, isLoading: isLoggingOut } = useAuth();

const handleLogout = async () => {
  try {
    await signOut();
  } catch (error: any) {
    toast.error(getFriendlyErrorMessage(error));
  }
};
</script>

<template>
  <div
    class="bg-background text-foreground flex min-h-svh flex-col items-center justify-center p-4"
  >
    <div class="w-full max-w-md text-center">
      <h1 class="text-foreground font-serif text-4xl font-extrabold tracking-tight">
        Milikku Dashboard
      </h1>
      <p class="text-muted-foreground mt-2 text-sm">Selamat datang, kamu berhasil login!</p>

      <div class="border-border bg-card mt-8 rounded-xl border p-6 text-left shadow-sm">
        <h2 class="text-foreground text-lg font-semibold">User Profile</h2>
        <div class="mt-4 space-y-2 text-sm">
          <p><span class="text-muted-foreground">Email:</span> {{ user?.email }}</p>
          <p>
            <span class="text-muted-foreground">ID:</span>
            <span class="font-mono text-xs">{{ user?.id }}</span>
          </p>
        </div>
      </div>

      <div class="mt-8">
        <Button variant="destructive" class="gap-2" :disabled="isLoggingOut" @click="handleLogout">
          <Loader2 v-if="isLoggingOut" class="h-4 w-4 animate-spin" />
          <LogOut v-else class="h-4 w-4" />
          {{ isLoggingOut ? 'Keluar...' : 'Logout' }}
        </Button>
      </div>
    </div>
  </div>
</template>
