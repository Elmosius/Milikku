import { ref } from 'vue';
import { toast } from 'vue-sonner';
import type { Category } from '~/types/category';

export function useCategories() {
  const {
    data: categories,
    pending,
    refresh,
  } = useFetch<Category[]>('/api/categories', {
    default: () => [],
  });

  // Dialog state
  const dialogOpen = ref(false);
  const dialogMode = ref<'create' | 'edit'>('create');
  const selectedCategory = ref<Category | null>(null);

  // Delete state
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

  return {
    categories,
    pending,
    refresh,
    dialogOpen,
    dialogMode,
    selectedCategory,
    deleteAlertOpen,
    categoryToDelete,
    isDeleting,
    openCreateDialog,
    openEditDialog,
    confirmDelete,
    handleDelete,
  };
}
