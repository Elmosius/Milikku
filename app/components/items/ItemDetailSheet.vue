<script setup lang="ts">
import { Edit, Folder, Trash2 } from 'lucide-vue-next';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Separator } from '~/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet';
import { iconMap } from '~/constants/icons';
import { locationIconMap } from '~/constants/locationIcons';
import type { Category } from '~/types/category';
import type { Item } from '~/types/item';
import type { Location } from '~/types/location';
import { formatCurrency } from '~/utils/currency';
import { formatDate } from '~/utils/date';

const props = defineProps<{
  open: boolean;
  item: Item | null;
  getCategory: (id: string | null | undefined) => Category | undefined;
  getLocation: (id: string | null | undefined) => Location | undefined;
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
          <Badge
            v-if="getCategory(item.categoryId)"
            variant="outline"
            :style="
              getCategory(item.categoryId)?.color
                ? {
                    borderColor: getCategory(item.categoryId)?.color as string,
                    color: getCategory(item.categoryId)?.color as string,
                  }
                : {}
            "
          >
            <component
              :is="iconMap[getCategory(item.categoryId)?.icon || 'Folder'] || Folder"
              class="mr-1.5 h-3 w-3"
              stroke-width="2"
            />
            {{ getCategory(item.categoryId)?.name }}
          </Badge>
          <Badge v-if="getLocation(item.locationId)" variant="outline">
            <component
              :is="locationIconMap[getLocation(item.locationId)?.icon || 'Folder'] || Folder"
              class="mr-1.5 h-3 w-3"
              stroke-width="2"
            />
            {{ getLocation(item.locationId)?.name }}
          </Badge>
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

          <!-- Categorization & Placement -->
          <div
            class="space-y-4"
            v-if="getCategory(item.categoryId) || getLocation(item.locationId)"
          >
            <h3 class="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Categorization & Placement
            </h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                v-if="getCategory(item.categoryId)"
                class="rounded-lg border p-4"
                :style="
                  getCategory(item.categoryId)?.color
                    ? {
                        borderColor: getCategory(item.categoryId)?.color as string,
                        backgroundColor: `${getCategory(item.categoryId)?.color}10`,
                      }
                    : {}
                "
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="bg-background rounded-full p-2 shadow-sm"
                    :style="
                      getCategory(item.categoryId)?.color
                        ? { color: getCategory(item.categoryId)?.color as string }
                        : { color: 'var(--muted-foreground)' }
                    "
                  >
                    <component
                      :is="iconMap[getCategory(item.categoryId)?.icon || 'Folder'] || Folder"
                      class="h-5 w-5"
                    />
                  </div>
                  <div>
                    <div class="text-sm font-medium">Category</div>
                    <div class="text-muted-foreground text-sm">
                      {{ getCategory(item.categoryId)?.name }}
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="getLocation(item.locationId)" class="bg-muted/30 rounded-lg border p-4">
                <div class="flex items-start space-x-3">
                  <div
                    class="bg-background text-muted-foreground shrink-0 rounded-full p-2 shadow-sm"
                  >
                    <component
                      :is="
                        locationIconMap[getLocation(item.locationId)?.icon || 'Folder'] || Folder
                      "
                      class="h-5 w-5"
                    />
                  </div>
                  <div>
                    <div class="text-sm font-medium">{{ getLocation(item.locationId)?.name }}</div>
                    <div class="text-muted-foreground mt-1 text-xs">
                      {{ getLocation(item.locationId)?.description || 'No description provided.' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator v-if="getCategory(item.categoryId) || getLocation(item.locationId)" />
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
