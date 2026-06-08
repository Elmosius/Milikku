import { toast } from 'vue-sonner';
import type { Item } from '~/types/item';
import type { Category } from '~/types/category';
import type { Location } from '~/types/location';
import type { ItemFormValues } from '~/validations/item';

export function useItems() {
  const queryParams = reactive({
    search: '',
    categoryId: 'all',
    locationId: 'all',
    condition: 'all',
    status: 'all',
    isFavorite: false,
    sortBy: 'newest',
    page: 1,
    limit: 10,
  });

  interface PaginatedResponse {
    items: Item[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }

  const {
    data: paginatedData,
    pending,
    refresh,
  } = useFetch<PaginatedResponse>('/api/items', {
    query: {
      search: computed(() => queryParams.search || undefined),
      categoryId: computed(() => queryParams.categoryId !== 'all' ? queryParams.categoryId : undefined),
      locationId: computed(() => queryParams.locationId !== 'all' ? queryParams.locationId : undefined),
      condition: computed(() => queryParams.condition !== 'all' ? queryParams.condition : undefined),
      status: computed(() => queryParams.status !== 'all' ? queryParams.status : undefined),
      isFavorite: computed(() => queryParams.isFavorite ? 'true' : undefined),
      sortBy: computed(() => queryParams.sortBy),
      page: computed(() => queryParams.page),
      limit: computed(() => queryParams.limit),
    },
    default: () => ({
      items: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
    }),
  });

  const items = computed(() => paginatedData.value?.items ?? []);
  const pagination = computed(() => paginatedData.value?.pagination);

  watch(
    () => [
      queryParams.search,
      queryParams.categoryId,
      queryParams.locationId,
      queryParams.condition,
      queryParams.status,
      queryParams.isFavorite,
      queryParams.sortBy,
    ],
    () => {
      queryParams.page = 1;
    }
  );

  const formOpen = ref(false);
  const formMode = ref<'create' | 'edit'>('create');
  const selectedItemToEdit = ref<Item | null>(null);
  const initialCreateData = ref<Partial<ItemFormValues> | null>(null);

  const openCreateForm = (initialData?: Partial<ItemFormValues>) => {
    formMode.value = 'create';
    selectedItemToEdit.value = null;
    initialCreateData.value = initialData || null;
    formOpen.value = true;
  };

  const openEditForm = (item: Item) => {
    formMode.value = 'edit';
    selectedItemToEdit.value = item;
    initialCreateData.value = null;
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

  const toggleFavorite = async (item: Item) => {
    const originalFavorite = item.isFavorite;
    item.isFavorite = !originalFavorite;
    
    try {
      await $fetch(`/api/items/${item.id}`, {
        method: 'PUT',
        body: { isFavorite: !originalFavorite }
      });
      toast.success(item.isFavorite ? 'Marked as favorite' : 'Removed from favorites');
      await refresh();
    } catch  {
      item.isFavorite = originalFavorite;
      toast.error('Failed to update favorite status');
    }
  };

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
    items,
    pagination,
    pending,
    refresh,
    queryParams,

    formOpen,
    formMode,
    selectedItemToEdit,
    initialCreateData,
    openCreateForm,
    openEditForm,
    handleSubmit,

    sheetOpen,
    selectedItemToView,
    openDetailSheet,
    editFromSheet,
    deleteFromSheet,

    deleteAlertOpen,
    itemToDelete,
    isDeleting,
    confirmDelete,
    handleDelete,

    toggleFavorite,

    getCategory,
    getLocation,
  };
}
