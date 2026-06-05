<script setup lang="ts">
import {
  Book,
  Briefcase,
  Camera,
  Car,
  Coffee,
  Folder,
  Gamepad2,
  Gift,
  Heart,
  Home,
  Laptop,
  MapPin,
  Music,
  Pencil,
  Plane,
  Plus,
  Shirt,
  ShoppingBag,
  Smartphone,
  Star,
  Trash2,
  Video,
} from 'lucide-vue-next';
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import CategoryDialog from '~/components/categories/CategoryDialog.vue';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
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

const iconMap: Record<string, any> = {
  Home,
  Briefcase,
  ShoppingBag,
  Gamepad2,
  Laptop,
  Smartphone,
  Book,
  Car,
  Plane,
  Coffee,
  Shirt,
  Camera,
  Folder,
  Heart,
  Star,
  Music,
  Video,
  MapPin,
  Gift,
};
interface Category {
  id: number;
  name: string;
  icon?: string | null;
  color?: string | null;
  createdAt: string;
}

// Data fetching
const {
  data: categories,
  pending,
  refresh,
} = await useFetch<Category[]>('/api/categories', {
  default: () => [],
});

// Dialog states
const dialogOpen = ref(false);
const dialogMode = ref<'create' | 'edit'>('create');
const selectedCategory = ref<Category | null>(null);

// Alert dialog states
const deleteAlertOpen = ref(false);
const categoryToDelete = ref<Category | null>(null);
const isDeleting = ref(false);

const openCreateDialog = () => {
  dialogMode.value = 'create';
  selectedCategory.value = null;
  dialogOpen.value = true;
};

const openEditDialog = (category: Category) => {
  dialogMode.value = 'edit';
  selectedCategory.value = category;
  dialogOpen.value = true;
};

const confirmDelete = (category: Category) => {
  categoryToDelete.value = category;
  deleteAlertOpen.value = true;
};

const handleDelete = async () => {
  if (!categoryToDelete.value) return;

  isDeleting.value = true;
  try {
    await $fetch(`/api/categories/${categoryToDelete.value.id}`, {
      method: 'DELETE',
    });
    toast.success('Category deleted successfully');
    await refresh();
  } catch (error: any) {
    toast.error(error.message || 'Failed to delete category');
  } finally {
    isDeleting.value = false;
    deleteAlertOpen.value = false;  
    categoryToDelete.value = null;
  }
};
</script>

<template>
  <div class="flex flex-1 flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-foreground text-2xl font-bold tracking-tight">Categories</h1>
      <Button @click="openCreateDialog"> <Plus class="mr-2 h-4 w-4" stroke-width="1.5" /> Add Category </Button>
    </div>

    <div class="bg-card rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-20">Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Color</TableHead>
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
              <TableCell><Skeleton class="h-6 w-6 rounded-full" /></TableCell>
              <TableCell><Skeleton class="h-5 w-25" /></TableCell>
              <TableCell class="text-right"><Skeleton class="inline-block h-8 w-25" /></TableCell>
            </TableRow>
          </template>

          <!-- Empty State -->
          <template v-else-if="!categories || categories.length === 0">
            <TableRow>
              <TableCell colspan="5" class="text-muted-foreground h-32 text-center">
                No categories found. Click "Add Category" to create one.
              </TableCell>
            </TableRow>
          </template>

          <!-- Data Rows -->
          <template v-else>
            <TableRow v-for="category in categories" :key="category.id">
              <TableCell>
                <component
                  :is="iconMap[category.icon || 'Folder']"
                  v-if="iconMap[category.icon || 'Folder']"
                  class="text-muted-foreground h-6 w-6"
                  stroke-width="1.5"
                />
                <Folder v-else class="text-muted-foreground h-6 w-6" stroke-width="1.5" />
              </TableCell>
              <TableCell class="font-medium">{{ category.name }}</TableCell>
              <TableCell>
                <div
                  v-if="category.color"
                  class="h-6 w-6 rounded-full border"
                  :style="{ backgroundColor: category.color }"
                ></div>
                <span v-else class="text-muted-foreground">-</span>
              </TableCell>
              <TableCell>{{
                category.createdAt ? new Date(category.createdAt).toLocaleDateString() : '-'
              }}</TableCell>
              <TableCell class="text-right">
                <Button variant="ghost" size="icon" @click="openEditDialog(category)">
                  <Pencil class="h-4 w-4" stroke-width="1.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  class="text-destructive hover:bg-destructive/10"
                  @click="confirmDelete(category)"
                >
                  <Trash2 class="h-4 w-4" stroke-width="1.5" />
                </Button>
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <!-- Category Form Dialog -->
    <CategoryDialog
      v-model:open="dialogOpen"
      :mode="dialogMode"
      :category="selectedCategory"
      @success="refresh"
    />

    <!-- Delete Confirmation -->
    <AlertDialog :open="deleteAlertOpen" @update:open="deleteAlertOpen = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the category "<span
              class="text-foreground font-medium"
              >{{ categoryToDelete?.name }}</span
            >".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel :disabled="isDeleting">Cancel</AlertDialogCancel>
          <AlertDialogAction
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            :disabled="isDeleting"
            @click="handleDelete"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
