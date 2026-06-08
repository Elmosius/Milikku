import { toast } from 'vue-sonner';
import type { Item } from '~/types/item';
import type { Category } from '~/types/category';
import type { Location } from '~/types/location';
import type { ItemFormValues } from '~/validations/item';

export function useItems() {
  // --- Filters state ---
  const queryParams = reactive({
    search: '',
    categoryId: 'all',
    locationId: 'all',
    condition: 'all',
    status: 'all',
    isFavorite: false,
    sortBy: 'newest',
  });

  // --- Data fetching ---
  const {
    data: items,
    pending,
    refresh,
  } = useFetch<Item[]>('/api/items', {
    query: queryParams,
    default: () => [],
  });

  // --- Form state ---
  const formOpen = ref(false);
  const formMode = ref<'create' | 'edit'>('create');
  const selectedItemToEdit = ref<Item | null>(null);

  const openCreateForm = () => {
    formMode.value = 'create';
    selectedItemToEdit.value = null;
    formOpen.value = true;
  };

  const openEditForm = (item: Item) => {
    formMode.value = 'edit';
    selectedItemToEdit.value = item;
    formOpen.value = true;
  };

  const handleSubmit = async (values: ItemFormValues, photoFile?: File | null) => {
    const isEdit = formMode.value === 'edit';
    pending.value = true;
    try {
      let savedItem: Item;

      if (isEdit && selectedItemToEdit.value) {
        savedItem = await $fetch<Item>(`/api/items/${selectedItemToEdit.value.id}`, {
          method: 'PUT',
          body: values,
        });
        toast.success('Item updated successfully');
      } else {
        savedItem = await $fetch<Item>('/api/items', {
          method: 'POST',
          body: values,
        });
        toast.success('Item created successfully');
      }

      // Upload photo if a file was selected
      if (photoFile && savedItem?.id) {
        const formData = new FormData();
        formData.append('photo', photoFile);
        await $fetch(`/api/items/${savedItem.id}/upload-photo`, {
          method: 'POST',
          body: formData,
        });
      }

      formOpen.value = false;
      await refresh();
    } catch (error: any) {
      toast.error(error.data?.statusMessage || error.message || 'An error occurred');
    } finally {
      pending.value = false;
    }
  };

  // --- Detail sheet state ---
  const sheetOpen = ref(false);
  const selectedItemToView = ref<Item | null>(null);

  const openDetailSheet = (item: Item) => {
    selectedItemToView.value = item;
    sheetOpen.value = true;
  };

  const editFromSheet = (item: Item) => {
    sheetOpen.value = false;
    openEditForm(item);
  };

  const deleteFromSheet = (item: Item) => {
    sheetOpen.value = false;
    confirmDelete(item);
  };

  // --- Delete state ---
  const deleteAlertOpen = ref(false);
  const itemToDelete = ref<Item | null>(null);
  const isDeleting = ref(false);

  const confirmDelete = (item: Item) => {
    itemToDelete.value = item;
    deleteAlertOpen.value = true;
  };

  const handleDelete = async () => {
    if (!itemToDelete.value) return;

    isDeleting.value = true;
    try {
      await $fetch(`/api/items/${itemToDelete.value.id}`, { method: 'DELETE' });
      toast.success('Item deleted successfully');
      await refresh();
    } catch (error: any) {
      toast.error(error.data?.statusMessage || error.message || 'Failed to delete item');
    } finally {
      isDeleting.value = false;
      deleteAlertOpen.value = false;
      itemToDelete.value = null;
    }
  };

  // --- Lookup helpers ---
  const { categories } = useCategories();
  const { locations } = useLocations();

  const getCategory = (id: string | null | undefined): Category | undefined => {
    if (!id) return undefined;
    return categories.value?.find((c) => c.id === id);
  };

  const getLocation = (id: string | null | undefined): Location | undefined => {
    if (!id) return undefined;
    return locations.value?.find((l) => l.id === id);
  };

  return {
    // Data
    items,
    pending,
    refresh,
    queryParams,

    // Form
    formOpen,
    formMode,
    selectedItemToEdit,
    openCreateForm,
    openEditForm,
    handleSubmit,

    // Detail sheet
    sheetOpen,
    selectedItemToView,
    openDetailSheet,
    editFromSheet,
    deleteFromSheet,

    // Delete
    deleteAlertOpen,
    itemToDelete,
    isDeleting,
    confirmDelete,
    handleDelete,

    // Lookup helpers
    getCategory,
    getLocation,
  };
}
