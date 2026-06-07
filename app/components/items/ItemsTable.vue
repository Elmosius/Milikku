<script setup lang="ts">
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '~/components/ui/table'
import { Skeleton } from '~/components/ui/skeleton'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Eye, Edit, Trash2 } from 'lucide-vue-next'
import type { Item } from '~/types/item'
import { SKELETON_ROW_COUNT } from '~/constants/item'

defineProps<{
  items: Item[]
  pending: boolean
  getCategoryName: (id: string | null | undefined) => string
  getLocationName: (id: string | null | undefined) => string
}>()

defineEmits<{
  view: [item: Item]
  edit: [item: Item]
  delete: [item: Item]
}>()
</script>

<template>
  <div class="rounded-md border bg-card">
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
            <TableCell class="text-right"><Skeleton class="h-8 w-24 ml-auto" /></TableCell>
          </TableRow>
        </template>

        <template v-else-if="items.length === 0">
          <TableRow>
            <TableCell colspan="7" class="h-24 text-center">
              No items found.
            </TableCell>
          </TableRow>
        </template>

        <template v-else>
          <TableRow v-for="item in items" :key="item.id">
            <TableCell class="font-medium">{{ item.name }}</TableCell>
            <TableCell>{{ getCategoryName(item.categoryId) }}</TableCell>
            <TableCell>{{ getLocationName(item.locationId) }}</TableCell>
            <TableCell>{{ item.quantity }}</TableCell>
            <TableCell>
              <Badge variant="outline">{{ item.condition || '-' }}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{{ item.status || '-' }}</Badge>
            </TableCell>
            <TableCell class="text-right space-x-1">
              <Button variant="ghost" size="icon" @click="$emit('view', item)">
                <Eye class="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" @click="$emit('edit', item)">
                <Edit class="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" @click="$emit('delete', item)" class="text-destructive hover:text-destructive">
                <Trash2 class="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
