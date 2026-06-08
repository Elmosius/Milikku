<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { Home, MapPin, Package, Tags } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import NavUser from './NavUser.vue';

const route = useRoute();
const { setOpenMobile } = useSidebar();

const navItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Items', url: '/items', icon: Package },
  { title: 'Categories', url: '/categories', icon: Tags },
  { title: 'Locations', url: '/locations', icon: MapPin },
];
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <div class="flex items-center gap-2 px-2 py-1.5">
        <img src="/logo.svg" alt="Milikku Logo" class="h-8 w-auto shrink-0" />
        <span
          class="font-serif text-lg font-extrabold tracking-tight group-data-[collapsible=icon]:hidden"
        >
          Milikku
        </span>
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in navItems" :key="item.title">
              <SidebarMenuButton
                as-child
                :tooltip="item.title"
                :isActive="route.path === item.url"
                @click="setOpenMobile(false)"
              >
                <NuxtLink :to="item.url">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <NavUser />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
