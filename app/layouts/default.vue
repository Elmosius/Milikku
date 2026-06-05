<script setup lang="ts">
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import AppSidebar from '@/components/app/AppSidebar.vue';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/composables/useAuth';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const { user } = useAuth();
const route = useRoute();

// Simple breadcrumb logic based on route path
const breadcrumbItems = computed(() => {
  const path = route.path;
  if (path === '/') return [{ label: 'Dashboard', path: '/' }];

  const segments = path.split('/').filter(Boolean);
  const items = [{ label: 'Home', path: '/' }];

  segments.forEach((segment, index) => {
    const currentPath = '/' + segments.slice(0, index + 1).join('/');
    items.push({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: currentPath,
    });
  });

  return items;
});
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="bg-background flex h-16 shrink-0 items-center justify-between border-b px-4">
        <div class="flex items-center gap-2">
          <SidebarTrigger class="text-muted-foreground hover:text-foreground -ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <template v-for="(item, index) in breadcrumbItems" :key="item.path">
                <BreadcrumbItem v-if="index === breadcrumbItems.length - 1">
                  <BreadcrumbPage class="font-semibold">{{ item.label }}</BreadcrumbPage>
                </BreadcrumbItem>
                <template v-else>
                  <BreadcrumbItem>
                    <BreadcrumbLink as-child>
                      <NuxtLink :to="item.path">{{ item.label }}</NuxtLink>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </template>
              </template>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <!-- Quick access user avatar -->
        <Avatar class="h-8 w-8 rounded-full border">
          <AvatarImage :src="user?.user_metadata?.avatar_url" :alt="user?.email" />
          <AvatarFallback class="bg-primary/10 text-primary rounded-full text-xs font-semibold">
            {{ user?.email?.charAt(0).toUpperCase() || 'U' }}
          </AvatarFallback>
        </Avatar>
      </header>
      <main class="flex flex-1 flex-col p-4 md:p-6">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
