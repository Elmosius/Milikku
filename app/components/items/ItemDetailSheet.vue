<script setup lang="ts">
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Separator } from '~/components/ui/separator';
import { Edit, Trash2 } from 'lucide-vue-next';
import type { Item } from '~/types/item';
import { formatCurrency } from '~/utils/currency';
import { formatDate } from '~/utils/date';

const props = defineProps<{
  open: boolean;
  item: Item | null;
  getCategoryName: (id: string | null | undefined) => string;
  getLocationName: (id: string | null | undefined) => string;
}>();

const emit = defineEmits<{
  'update:open': [val: boolean];
  edit: [item: Item];
  delete: [item: Item];
}>();

const imageError = ref(false);

watch(
  () => props.item,
  () => {
    imageError.value = false;
  },
);
</script>

<template>
  <Sheet :open="open" @update:open="emit('update:open', $event)">
    <SheetContent class="flex w-full flex-col p-0 sm:max-w-md" v-if="item">
      <SheetHeader class="space-y-0 px-6 pt-6 pb-4">
        <div class="flex items-center justify-between">
          <SheetTitle class="text-2xl font-bold">{{ item.name }}</SheetTitle>
          <div class="flex items-center space-x-2">
            <Button variant="ghost" size="icon" @click="emit('edit', item)">
              <Edit class="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              @click="emit('delete', item)"
              class="text-destructive"
            >
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          <Badge v-if="item.categoryId" variant="outline">{{
            getCategoryName(item.categoryId)
          }}</Badge>
          <Badge v-if="item.locationId" variant="outline">{{
            getLocationName(item.locationId)
          }}</Badge>
          <Badge v-if="item.status">{{ item.status }}</Badge>
          <Badge v-if="item.condition" variant="outline">{{ item.condition }}</Badge>
          <Badge
            v-if="item.isFavorite"
            variant="secondary"
            class="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
          >
            ★ Favorite
          </Badge>
        </div>
      </SheetHeader>

      <ScrollArea class="flex-1 px-6">
        <div class="space-y-6 pb-6">
          <!-- Photo -->
          <div
            v-if="item.photoUrl && !imageError"
            class="bg-muted/50 mb-6 flex h-48 w-full items-center justify-center overflow-hidden rounded-md"
          >
            <img
              :src="item.photoUrl"
              alt="Item photo"
              class="h-full w-full object-cover"
              @error="imageError = true"
            />
          </div>

          <!-- Basic Info -->
          <div class="space-y-4">
            <h3 class="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Basic Information
            </h3>
            <div class="grid grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <div class="text-muted-foreground mb-1 text-sm font-medium">Quantity</div>
                <div class="font-medium">{{ item.quantity }}</div>
              </div>
              <div>
                <div class="text-muted-foreground mb-1 text-sm font-medium">Brand</div>
                <div class="font-medium">{{ item.brand || '-' }}</div>
              </div>
              <div>
                <div class="text-muted-foreground mb-1 text-sm font-medium">Model</div>
                <div class="font-medium">{{ item.model || '-' }}</div>
              </div>
              <div>
                <div class="text-muted-foreground mb-1 text-sm font-medium">Serial Number</div>
                <div class="truncate font-medium" :title="item.serialNumber || ''">
                  {{ item.serialNumber || '-' }}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <!-- Purchase Details -->
          <div class="space-y-4">
            <h3 class="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Purchase Details
            </h3>
            <div class="grid grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <div class="text-muted-foreground mb-1 text-sm font-medium">Price</div>
                <div class="font-medium">{{ formatCurrency(item.purchasePrice) }}</div>
              </div>
              <div>
                <div class="text-muted-foreground mb-1 text-sm font-medium">Date</div>
                <div class="font-medium">{{ formatDate(item.purchaseDate) }}</div>
              </div>
              <div class="col-span-2">
                <div class="text-muted-foreground mb-1 text-sm font-medium">Location</div>
                <div class="font-medium">{{ item.purchaseLocation || '-' }}</div>
              </div>
              <div>
                <div class="text-muted-foreground mb-1 text-sm font-medium">Warranty Expiry</div>
                <div class="font-medium">{{ formatDate(item.warrantyExpiry) }}</div>
              </div>
            </div>
          </div>

          <Separator />

          <!-- Notes -->
          <div class="space-y-3">
            <h3 class="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Notes
            </h3>
            <p class="text-sm whitespace-pre-wrap">{{ item.notes || 'No notes provided.' }}</p>
          </div>
        </div>
      </ScrollArea>
    </SheetContent>
  </Sheet>
</template>
