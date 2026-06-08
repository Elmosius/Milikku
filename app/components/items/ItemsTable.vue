<script setup lang="ts">
import { Edit, Eye, Folder, Trash2 } from 'lucide-vue-next';
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

defineProps<{
  items: Item[];
  pending: boolean;
  getCategory: (id: string | null | undefined) => Category | undefined;
  getLocation: (id: string | null | undefined) => Location | undefined;
}>();

defineEmits<{
  view: [item: Item];
  edit: [item: Item];
  delete: [item: Item];
}>();
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
            <TableCell class="font-medium">{{ item.name }}</TableCell>
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
  </div>
</template>
