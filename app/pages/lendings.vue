<script setup lang="ts">
import { ArrowLeftRight, Check, HandCoins, Package, Phone, Trash2, User } from 'lucide-vue-next';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import LendItemDialog from '~/components/lendings/LendItemDialog.vue';
import DeleteLendingDialog from '~/components/lendings/DeleteLendingDialog.vue';
import { formatDate } from '~/utils/date';

const {
  activeLendings,
  returnedLendings,
  pending,
  dialogOpen,
  selectedItemId,
  isCreating,
  handleCreate,
  handleReturn,
  isReturning,
  deleteAlertOpen,
  lendingToDelete,
  isDeleting,
  confirmDelete,
  handleDelete,
} = useLendings();
const route = useRoute();
const highlightedLendingId = ref<string | null>(null);

const { data: allItems } = useFetch('/api/items', {
  query: { limit: 100 },
  default: () => ({ items: [] }),
  transform: (data: any) => data,
});

const items = computed(() => allItems.value?.items ?? []);

const openLendDialog = () => {
  selectedItemId.value = null;
  dialogOpen.value = true;
};

const isOverdue = (lending: any) => {
  if (!lending.expectedReturnAt || lending.returnedAt) return false;
  return new Date(lending.expectedReturnAt) < new Date();
};

const highlightLendingFromQuery = async () => {
  const lendingId = typeof route.query.lending === 'string' ? route.query.lending : null;
  if (!lendingId || !activeLendings.value.some((lending) => lending.id === lendingId)) return;

  highlightedLendingId.value = lendingId;
  await nextTick();
  document.getElementById(`lending-${lendingId}`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
};

watch([() => route.query.lending, activeLendings], highlightLendingFromQuery, { immediate: true });
</script>

<template>
  <div class="flex flex-1 flex-col gap-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Lendings</h1>
        <p class="text-muted-foreground text-sm">Manage lent items</p>
      </div>
      <Button @click="openLendDialog">
        <HandCoins class="mr-2 h-4 w-4" />
        Lend Item
      </Button>
    </div>

    <Tabs default-value="active" class="w-full">
      <TabsList class="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="active">
          Active
          <Badge v-if="activeLendings.length" variant="secondary" class="ml-2">
            {{ activeLendings.length }}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="returned">
          Returned
          <Badge v-if="returnedLendings.length" variant="secondary" class="ml-2">
            {{ returnedLendings.length }}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="active" class="mt-4">
        <div v-if="pending" class="text-muted-foreground py-12 text-center text-sm">
          Loading...
        </div>
        <div v-else-if="activeLendings.length === 0" class="py-12 text-center">
          <ArrowLeftRight class="text-muted-foreground mx-auto mb-3 h-12 w-12" />
          <p class="text-muted-foreground text-sm">No items are currently lent out</p>
        </div>
        <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            v-for="lending in activeLendings"
            :id="`lending-${lending.id}`"
            :key="lending.id"
            class="relative overflow-hidden transition-shadow"
            :class="{
              'ring-primary ring-2 ring-offset-2 ring-offset-background':
                highlightedLendingId === lending.id,
            }"
          >
            <div v-if="isOverdue(lending)" class="bg-destructive absolute top-0 right-0 left-0 h-1" />
            <CardContent class="p-4">
              <div class="mb-3 flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <div class="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                    <Package class="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p class="font-semibold leading-tight">{{ lending.item?.name || 'Unknown Item' }}</p>
                    <div class="flex items-center gap-1.5 mt-1">
                      <Badge v-if="isOverdue(lending)" variant="destructive" class="text-xs">Overdue</Badge>
                      <Badge v-else variant="default" class="text-xs">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator class="my-3" />

              <div class="space-y-2 text-sm">
                <div class="flex items-center gap-2">
                  <User class="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                  <span class="font-medium">{{ lending.borrowerName }}</span>
                </div>
                <div v-if="lending.borrowerContact" class="flex items-center gap-2">
                  <Phone class="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                  <span class="text-muted-foreground">{{ lending.borrowerContact }}</span>
                </div>
                <div class="text-muted-foreground text-xs">
                  Lent: {{ formatDate(lending.lentAt) }}
                  <span v-if="lending.expectedReturnAt"> · Target: {{ formatDate(lending.expectedReturnAt) }}</span>
                </div>
                <p v-if="lending.notes" class="text-muted-foreground text-xs italic">{{ lending.notes }}</p>
              </div>

              <div class="mt-4 flex gap-2">
                <Button
                  size="sm"
                  class="flex-1"
                  :disabled="isReturning(lending.id)"
                  @click="handleReturn(lending)"
                >
                  <Check class="mr-1.5 h-3.5 w-3.5" />
                  {{ isReturning(lending.id) ? 'Returning...' : 'Mark as Returned' }}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  class="text-destructive"
                  :disabled="isReturning(lending.id)"
                  @click="confirmDelete(lending)"
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="returned" class="mt-4">
        <div v-if="returnedLendings.length === 0" class="py-12 text-center">
          <Check class="text-muted-foreground mx-auto mb-3 h-12 w-12" />
          <p class="text-muted-foreground text-sm">No return history</p>
        </div>
        <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card v-for="lending in returnedLendings" :key="lending.id" class="opacity-75">
            <CardContent class="p-4">
              <div class="mb-3 flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <div class="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                    <Package class="text-muted-foreground h-5 w-5" />
                  </div>
                  <div>
                    <p class="font-semibold leading-tight">{{ lending.item?.name || 'Unknown Item' }}</p>
                    <Badge variant="outline" class="mt-1 text-xs text-green-600 border-green-300">Returned</Badge>
                  </div>
                </div>
              </div>

              <Separator class="my-3" />

              <div class="space-y-2 text-sm">
                <div class="flex items-center gap-2">
                  <User class="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                  <span class="font-medium">{{ lending.borrowerName }}</span>
                </div>
                <div class="text-muted-foreground text-xs">
                  {{ formatDate(lending.lentAt) }} → {{ formatDate(lending.returnedAt) }}
                </div>
              </div>

              <div class="mt-4 flex justify-end">
                <Button size="sm" variant="ghost" class="text-destructive" @click="confirmDelete(lending)">
                  <Trash2 class="mr-1.5 h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>

    <LendItemDialog
      v-model:open="dialogOpen"
      :item-id="selectedItemId"
      :items="items"
      :is-submitting="isCreating"
      @submit="handleCreate"
    />

    <DeleteLendingDialog
      :open="deleteAlertOpen"
      :lending="lendingToDelete"
      :is-deleting="isDeleting"
      @update:open="deleteAlertOpen = $event"
      @confirm="handleDelete"
    />
  </div>
</template>
