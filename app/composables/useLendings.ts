import { ref } from 'vue';
import { toast } from 'vue-sonner';
import type { Lending } from '~/types/lending';
import type { LendingFormValues } from '~/validations/lending';

export function useLendings(itemId?: Ref<string | undefined>) {
  const {
    data: lendings,
    pending,
    refresh,
  } = useFetch<Lending[]>('/api/lendings', {
    query: {
      itemId: itemId ? computed(() => itemId.value || undefined) : undefined,
    },
    default: () => [],
  });

  const dialogOpen = ref(false);
  const selectedItemId = ref<string | null>(null);

  const deleteAlertOpen = ref(false);
  const lendingToDelete = ref<Lending | null>(null);
  const isDeleting = ref(false);

  const openLendDialog = (forItemId: string) => {
    selectedItemId.value = forItemId;
    dialogOpen.value = true;
  };

  const handleCreate = async (values: LendingFormValues) => {
    try {
      await $fetch('/api/lendings', {
        method: 'POST',
        body: values,
      });
      toast.success('Item lent successfully');
      dialogOpen.value = false;
      await refresh();
    } catch (error: any) {
      toast.error(error.data?.statusMessage || error.message || 'Failed to create lending');
    }
  };

  const handleReturn = async (lending: Lending) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await $fetch(`/api/lendings/${lending.id}`, {
        method: 'PUT',
        body: { returnedAt: today },
      });
      toast.success('Item marked as returned');
      await refresh();
    } catch (error: any) {
      toast.error(error.data?.statusMessage || error.message || 'Failed to mark as returned');
    }
  };

  const confirmDelete = (lending: Lending) => {
    lendingToDelete.value = lending;
    deleteAlertOpen.value = true;
  };

  const handleDelete = async () => {
    if (!lendingToDelete.value) return;

    isDeleting.value = true;
    try {
      await $fetch(`/api/lendings/${lendingToDelete.value.id}`, { method: 'DELETE' });
      toast.success('Lending record deleted');
      await refresh();
    } catch (error: any) {
      toast.error(error.data?.statusMessage || error.message || 'Failed to delete');
    } finally {
      isDeleting.value = false;
      deleteAlertOpen.value = false;
      lendingToDelete.value = null;
    }
  };

  const activeLendings = computed(() =>
    lendings.value?.filter((l) => !l.returnedAt) ?? []
  );

  const returnedLendings = computed(() =>
    lendings.value?.filter((l) => !!l.returnedAt) ?? []
  );

  return {
    lendings,
    activeLendings,
    returnedLendings,
    pending,
    refresh,

    dialogOpen,
    selectedItemId,
    openLendDialog,
    handleCreate,
    handleReturn,

    deleteAlertOpen,
    lendingToDelete,
    isDeleting,
    confirmDelete,
    handleDelete,
  };
}
