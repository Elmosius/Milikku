<script setup lang="ts">
import { ref, watch } from 'vue';
import { LogOut, Monitor, Moon, Sun, Upload, User as UserIcon } from 'lucide-vue-next';
import { useAuth } from '~/composables/useAuth';
import { useProfile } from '~/composables/useProfile';
import { useColorMode } from '@vueuse/core';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';

const { user, signOut } = useAuth();
const { profile, pending, isUpdating, isUploading, updateProfile, uploadAvatar } = useProfile();
const colorMode = useColorMode();

const fullName = ref('');
const fileInput = ref<HTMLInputElement | null>(null);

// Sync local state when profile loads
watch(
  profile,
  (newProfile) => {
    if (newProfile?.fullName) {
      fullName.value = newProfile.fullName;
    }
  },
  { immediate: true },
);

const handleSaveProfile = async () => {
  await updateProfile({ fullName: fullName.value });
};

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    await uploadAvatar(file);
    target.value = ''; // Reset input
  }
};
</script>

<template>
  <div class="flex flex-1 flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-foreground text-2xl font-bold tracking-tight">Settings</h1>
    </div>

    <!-- Profile Settings -->
    <div class="bg-card rounded-xl border p-6">
      <h2 class="text-lg font-semibold mb-4">Profile</h2>
      <div class="flex flex-col sm:flex-row gap-6 items-start">
        <div class="flex flex-col items-center gap-3">
          <Avatar class="h-24 w-24 border">
            <AvatarImage v-if="profile?.avatarUrl" :src="profile.avatarUrl" :alt="profile.fullName || 'User'" />
            <AvatarFallback class="bg-primary/10">
              <UserIcon class="h-10 w-10 text-primary" stroke-width="1.5" />
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm" class="w-full" :disabled="isUploading" @click="triggerFileUpload">
            <Upload class="mr-2 h-4 w-4" />
            {{ isUploading ? 'Uploading...' : 'Change Avatar' }}
          </Button>
          <input
            type="file"
            ref="fileInput"
            class="hidden"
            accept="image/*"
            @change="handleFileChange"
          />
        </div>

        <div class="flex-1 space-y-4 w-full">
          <div class="space-y-1.5">
            <Label for="email">Email Address</Label>
            <Input id="email" type="email" :value="user?.email" disabled class="bg-muted" />
            <p class="text-[0.8rem] text-muted-foreground">Your email cannot be changed here.</p>
          </div>

          <div class="space-y-1.5">
            <Label for="fullName">Full Name</Label>
            <Input id="fullName" type="text" v-model="fullName" placeholder="Enter your full name" :disabled="pending" />
          </div>

          <div class="flex justify-end pt-2">
            <Button @click="handleSaveProfile" :disabled="isUpdating || pending">
              {{ isUpdating ? 'Saving...' : 'Save Changes' }}
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Appearance -->
    <div class="bg-card rounded-xl border p-6">
      <h2 class="text-lg font-semibold mb-4">Appearance</h2>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-medium">Theme</h3>
          <p class="text-sm text-muted-foreground">Select your preferred application theme.</p>
        </div>
        <Select v-model="colorMode">
          <SelectTrigger class="w-[180px]">
            <div class="flex items-center gap-2">
              <Sun v-if="colorMode === 'light'" class="h-4 w-4" />
              <Moon v-else-if="colorMode === 'dark'" class="h-4 w-4" />
              <Monitor v-else class="h-4 w-4" />
              <SelectValue placeholder="Select theme" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="auto">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="bg-card rounded-xl border border-destructive/20 p-6">
      <h2 class="text-lg font-semibold text-destructive mb-4">Danger Zone</h2>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-medium">Sign Out</h3>
          <p class="text-sm text-muted-foreground">End your current session and return to the login screen.</p>
        </div>
        <Button variant="destructive" @click="signOut">
          <LogOut class="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  </div>
</template>
