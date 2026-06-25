<script setup lang="ts">
import { ChevronLeft, ChevronRight, Edit, Eye, Folder, Star, Trash2 } from 'lucide-vue-next';
import { computed } from 'vue';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { iconMap } from '~/constants/icons';
import { SKELETON_ROW_COUNT } from '~/constants/item';
import { locationIconMap } from '~/constants/locationIcons';
import type { Category } from '~/types/category';
import type { Item } from '~/types/item';
import type { Location } from '~/types/location';

const props = defineProps<{
  items: Item[];
  pending: boolean;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  getCategory: (id: string | null | undefined) => Category | undefined;
  getLocation: (id: string | null | undefined) => Location | undefined;
  isFavoriteUpdating?: (itemId: string) => boolean;
}>();

const emit = defineEmits<{
  view: [item: Item];
  edit: [item: Item];
  delete: [item: Item];
  toggleFavorite: [item: Item];
  changePage: [page: number];
  changeLimit: [limit: number];
}>();

const visiblePages = computed(() => {
  if (!props.pagination) return [];
  const { page, totalPages } = props.pagination;
  const range = 2; // Number of pages to show before and after current page
  const pages: number[] = [];

  let start = Math.max(1, page - range);
  let end = Math.min(totalPages, page + range);

  // Adjust start/end if we are near the boundaries
  if (page <= range) {
    end = Math.min(totalPages, start + range * 2);
  } else if (page > totalPages - range) {
    start = Math.max(1, end - range * 2);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});
</script>

<template>
  <div class="bg-card rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Condition</TableHead>
          <TableHead>Status</TableHead>
          <TableHead class="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="pending">
          <TableRow v-for="i in SKELETON_ROW_COUNT" :key="i">
            <TableCell><Skeleton class="h-5 w-32" /></TableCell>
            <TableCell><Skeleton class="h-5 w-20" /></TableCell>
            <TableCell><Skeleton class="h-5 w-20" /></TableCell>
            <TableCell><Skeleton class="h-5 w-12" /></TableCell>
            <TableCell><Skeleton class="h-5 w-24" /></TableCell>
            <TableCell><Skeleton class="h-5 w-24" /></TableCell>
            <TableCell class="text-right"><Skeleton class="ml-auto h-8 w-24" /></TableCell>
          </TableRow>
        </template>

        <template v-else-if="items.length === 0">
          <TableRow>
            <TableCell colspan="7" class="h-24 text-center"> No items found. </TableCell>
          </TableRow>
        </template>

        <template v-else>
          <TableRow v-for="item in items" :key="item.id">
            <TableCell class="font-medium">
              <div class="flex items-center gap-2">
                <button
                  @click.stop="$emit('toggleFavorite', item)"
                  :disabled="isFavoriteUpdating?.(item.id)"
                  class="text-muted-foreground transition-colors hover:text-yellow-500 focus:outline-none"
                  :class="{ 'text-yellow-500': item.isFavorite }"
                  title="Toggle Favorite"
                >
                  <Star :class="{ 'fill-current': item.isFavorite }" class="h-4 w-4" />
                </button>
                <span>{{ item.name }}</span>
              </div>
            </TableCell>
            <TableCell>
              <div v-if="getCategory(item.categoryId)" class="flex items-center space-x-2">
                <component
                  :is="iconMap[getCategory(item.categoryId)?.icon || 'Folder'] || Folder"
                  class="text-muted-foreground h-4 w-4 shrink-0"
                  stroke-width="1.5"
                />
                <div class="flex items-center space-x-1.5">
                  <span>{{ getCategory(item.categoryId)?.name }}</span>
                  <div
                    v-if="getCategory(item.categoryId)?.color"
                    class="h-2 w-2 rounded-full"
                    :style="{ backgroundColor: getCategory(item.categoryId)?.color as string }"
                  ></div>
                </div>
              </div>
              <span v-else>-</span>
            </TableCell>
            <TableCell>
              <div v-if="getLocation(item.locationId)" class="flex items-center space-x-2">
                <component
                  :is="locationIconMap[getLocation(item.locationId)?.icon || 'Folder'] || Folder"
                  class="text-muted-foreground h-4 w-4 shrink-0"
                  stroke-width="1.5"
                />
                <TooltipProvider v-if="getLocation(item.locationId)?.description">
                  <Tooltip>
                    <TooltipTrigger>
                      <span class="border-muted-foreground/50 cursor-help border-b border-dashed">{{
                        getLocation(item.locationId)?.name
                      }}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p class="max-w-xs">{{ getLocation(item.locationId)?.description }}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span v-else>{{ getLocation(item.locationId)?.name }}</span>
              </div>
              <span v-else>-</span>
            </TableCell>
            <TableCell>{{ item.quantity }}</TableCell>
            <TableCell>
              <Badge variant="outline">{{ item.condition || '-' }}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{{ item.status || '-' }}</Badge>
            </TableCell>
            <TableCell class="space-x-1 text-right">
              <Button variant="ghost" size="icon" @click="$emit('view', item)">
                <Eye class="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" @click="$emit('edit', item)">
                <Edit class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                @click="$emit('delete', item)"
                class="text-destructive hover:text-destructive"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>

    <!-- Pagination Footer -->
    <div
      v-if="pagination && pagination.totalPages > 0"
      class="bg-card text-card-foreground flex flex-col gap-3 border-t px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <!-- Range info -->
        <span class="text-muted-foreground text-xs sm:text-sm">
          Showing
          <span class="font-semibold">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
          to
          <span class="font-semibold">{{
            Math.min(pagination.page * pagination.limit, pagination.total)
          }}</span>
          of
          <span class="font-semibold">{{ pagination.total }}</span>
          entries
        </span>

        <!-- Page size selector -->
        <div class="flex items-center space-x-2">
          <span class="text-muted-foreground text-xs">Per Page:</span>
          <select
            :value="pagination.limit"
            @change="$emit('changeLimit', parseInt(($event.target as HTMLSelectElement).value, 10))"
            class="border-input bg-background focus-visible:ring-ring h-8 w-16 cursor-pointer rounded-md border px-2 py-1 text-xs focus-visible:ring-1 focus-visible:outline-none"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="flex items-center justify-end space-x-1">
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.page === 1"
          @click="$emit('changePage', pagination.page - 1)"
          class="flex h-8 items-center px-2"
        >
          <ChevronLeft class="mr-1 h-4 w-4" />
          Previous
        </Button>

        <!-- Page numbers -->
        <div class="hidden items-center space-x-1 sm:flex">
          <Button
            v-for="p in visiblePages"
            :key="p"
            variant="outline"
            size="sm"
            @click="$emit('changePage', p)"
            class="h-8 w-8 p-0"
            :class="{
              'bg-primary text-primary-foreground border-primary hover:bg-primary hover:text-primary-foreground':
                p === pagination.page,
            }"
          >
            {{ p }}
          </Button>
        </div>

        <!-- Mobile current page / total indicator -->
        <span class="text-muted-foreground px-2 text-xs sm:hidden">
          Page {{ pagination.page }} of {{ pagination.totalPages }}
        </span>

        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.page === pagination.totalPages"
          @click="$emit('changePage', pagination.page + 1)"
          class="flex h-8 items-center px-2"
        >
          Next
          <ChevronRight class="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
