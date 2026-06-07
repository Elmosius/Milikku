<script setup lang="ts">
import { Folder, Pencil, Trash2 } from 'lucide-vue-next';
import type { Location } from '~/types/location';
import { locationIconMap as iconMap } from '~/constants/locationIcons';
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

defineProps<{
  locations: Location[];
  pending: boolean;
}>();

defineEmits<{
  (e: 'edit', location: Location): void;
  (e: 'delete', location: Location): void;
}>();
</script>

<template>
  <div class="bg-card rounded-xl border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-20">Icon</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead class="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <!-- Loading State -->
        <template v-if="pending">
          <TableRow v-for="i in 3" :key="i">
            <TableCell><Skeleton class="h-8 w-8 rounded-full" /></TableCell>
            <TableCell><Skeleton class="h-5 w-37.5" /></TableCell>
            <TableCell><Skeleton class="h-5 w-48" /></TableCell>
            <TableCell><Skeleton class="h-5 w-25" /></TableCell>
            <TableCell class="text-right"><Skeleton class="inline-block h-8 w-25" /></TableCell>
          </TableRow>
        </template>

        <!-- Empty State -->
        <template v-else-if="!locations || locations.length === 0">
          <TableRow>
            <TableCell colspan="5" class="text-muted-foreground h-32 text-center">
              No locations found. Click "Add Location" to create one.
            </TableCell>
          </TableRow>
        </template>

        <!-- Data Rows -->
        <template v-else>
          <TableRow v-for="location in locations" :key="location.id">
            <TableCell>
              <component
                :is="iconMap[location.icon || 'Folder']"
                v-if="iconMap[location.icon || 'Folder']"
                class="text-muted-foreground h-6 w-6"
                stroke-width="1.5"
              />
              <Folder v-else class="text-muted-foreground h-6 w-6" stroke-width="1.5" />
            </TableCell>
            <TableCell class="font-medium">{{ location.name }}</TableCell>
            <TableCell class="max-w-xs truncate" :title="location.description || ''">
              {{ location.description || '-' }}
            </TableCell>
            <TableCell>{{
              location.createdAt ? new Date(location.createdAt).toLocaleDateString() : '-'
            }}</TableCell>
            <TableCell class="text-right">
              <Button variant="ghost" size="icon" @click="$emit('edit', location)">
                <Pencil class="h-4 w-4" stroke-width="1.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                class="text-destructive hover:bg-destructive/10"
                @click="$emit('delete', location)"
              >
                <Trash2 class="h-4 w-4" stroke-width="1.5" />
              </Button>
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
