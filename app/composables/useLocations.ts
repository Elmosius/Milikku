import { ref } from 'vue';
import { toast } from 'vue-sonner';
import type { Location } from '~/types/location';

export function useLocations() {
  const {
    data: locations,
    pending,
    refresh,
  } = useFetch<Location[]>('/api/locations', {
    default: () => [],
  });

  const dialogOpen = ref(false);
  const dialogMode = ref<'create' | 'edit'>('create');
  const selectedLocation = ref<Location | null>(null);

  const deleteAlertOpen = ref(false);
  const locationToDelete = ref<Location | null>(null);
  const isDeleting = ref(false);

  const openCreateDialog = () => {
    dialogMode.value = 'create';
    selectedLocation.value = null;
    dialogOpen.value = true;
  };

  const openEditDialog = (location: Location) => {
    dialogMode.value = 'edit';
    selectedLocation.value = location;
    dialogOpen.value = true;
  };

  const confirmDelete = (location: Location) => {
    locationToDelete.value = location;
    deleteAlertOpen.value = true;
  };

  const handleDelete = async () => {
    if (!locationToDelete.value) return;
    isDeleting.value = true;
    try {
      await $fetch(`/api/locations/${locationToDelete.value.id}`, {
        method: 'DELETE',
      });
      toast.success('Location deleted successfully');
      await refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete location');
    } finally {
      isDeleting.value = false;
      deleteAlertOpen.value = false;
      locationToDelete.value = null;
    }
  };

  return {
    locations,
    pending,
    refresh,
    dialogOpen,
    dialogMode,
    selectedLocation,
    deleteAlertOpen,
    locationToDelete,
    isDeleting,
    openCreateDialog,
    openEditDialog,
    confirmDelete,
    handleDelete,
  };
}
