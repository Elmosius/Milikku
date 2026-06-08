<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Switch } from '~/components/ui/switch';
import { useCategories } from '~/composables/useCategories';
import { useLocations } from '~/composables/useLocations';
import { ITEM_CONDITIONS, ITEM_STATUSES } from '~/constants/item';

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
  <div class="bg-card flex flex-col gap-4 rounded-xl border p-4">
    <!-- Top row: Search and Favorite Toggle -->
    <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div class="relative w-full sm:max-w-md">
        <Search class="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
        <Input
          v-model="queryParams.search"
          placeholder="Search name, brand, or model..."
          class="pl-9"
        />
      </div>
      <div class="flex shrink-0 items-center space-x-2">
        <Switch
          id="favorite-filter"
          v-model="queryParams.isFavorite"
        />
        <Label for="favorite-filter" class="cursor-pointer select-none">Favorites Only</Label>
      </div>
    </div>

    <!-- Bottom row: Dropdown filters -->
    <div class="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
      <!-- Category -->
      <div class="space-y-1 sm:w-42.5">
        <Label class="text-muted-foreground text-xs">Category</Label>
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
      <div class="space-y-1 sm:w-42.5">
        <Label class="text-muted-foreground text-xs">Location</Label>
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
      <div class="space-y-1 sm:w-42.5">
        <Label class="text-muted-foreground text-xs">Condition</Label>
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
      <div class="space-y-1 sm:w-42.5">
        <Label class="text-muted-foreground text-xs">Status</Label>
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
      <div class="space-y-1 sm:w-42.5">
        <Label class="text-muted-foreground text-xs">Sort By</Label>
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
