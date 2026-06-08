<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import { Input } from '~/components/ui/input';
import { Switch } from '~/components/ui/switch';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { ITEM_CONDITIONS, ITEM_STATUSES } from '~/constants/item';
import { useCategories } from '~/composables/useCategories';
import { useLocations } from '~/composables/useLocations';

defineProps<{
  queryParams: {
    search: string;
    categoryId: string;
    locationId: string;
    condition: string;
    status: string;
    isFavorite: boolean;
    sortBy: string;
  };
}>();

const { categories } = useCategories();
const { locations } = useLocations();
</script>

<template>
  <div class="bg-card rounded-xl border p-4 flex flex-col gap-4">
    <!-- Top row: Search and Favorite Toggle -->
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div class="relative w-full sm:max-w-md">
        <Search class="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          v-model="queryParams.search" 
          placeholder="Search name, brand, or model..." 
          class="pl-9"
        />
      </div>
      <div class="flex items-center space-x-2 shrink-0">
        <Switch id="favorite-filter" :checked="queryParams.isFavorite" @update:checked="queryParams.isFavorite = $event" />
        <Label for="favorite-filter" class="cursor-pointer">Favorites Only</Label>
      </div>
    </div>

    <!-- Bottom row: Dropdown filters -->
    <div class="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-3">
      <!-- Category -->
      <div class="space-y-1 sm:w-[170px]">
        <Label class="text-xs text-muted-foreground">Category</Label>
        <Select v-model="queryParams.categoryId">
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Location -->
      <div class="space-y-1 sm:w-[170px]">
        <Label class="text-xs text-muted-foreground">Location</Label>
        <Select v-model="queryParams.locationId">
          <SelectTrigger>
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem v-for="loc in locations" :key="loc.id" :value="loc.id">
              {{ loc.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Condition -->
      <div class="space-y-1 sm:w-[170px]">
        <Label class="text-xs text-muted-foreground">Condition</Label>
        <Select v-model="queryParams.condition">
          <SelectTrigger>
            <SelectValue placeholder="All Conditions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            <SelectItem v-for="cond in ITEM_CONDITIONS" :key="cond" :value="cond">
              {{ cond }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Status -->
      <div class="space-y-1 sm:w-[170px]">
        <Label class="text-xs text-muted-foreground">Status</Label>
        <Select v-model="queryParams.status">
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem v-for="stat in ITEM_STATUSES" :key="stat" :value="stat">
              {{ stat }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Sort -->
      <div class="space-y-1 sm:w-[170px]">
        <Label class="text-xs text-muted-foreground">Sort By</Label>
        <Select v-model="queryParams.sortBy">
          <SelectTrigger>
            <SelectValue placeholder="Sort..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
</template>
