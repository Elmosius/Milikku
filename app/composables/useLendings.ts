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
  const isCreating = ref(false);
  const returningIds = ref(new Set<string>());

  const deleteAlertOpen = ref(false);
  const lendingToDelete = ref<Lending | null>(null);
  const isDeleting = ref(false);

  const openLendDialog = (forItemId: string) => {
    selectedItemId.value = forItemId;
    dialogOpen.value = true;
  };

  const handleCreate = async (values: LendingFormValues) => {
    if (isCreating.value) return;

    isCreating.value = true;
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
    } finally {
      isCreating.value = false;
    }
  };

  const handleReturn = async (lending: Lending) => {
    if (returningIds.value.has(lending.id)) return;

    returningIds.value = new Set(returningIds.value).add(lending.id);
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
    } finally {
      const nextIds = new Set(returningIds.value);
      nextIds.delete(lending.id);
      returningIds.value = nextIds;
    }
  };

  const isReturning = (lendingId: string) => returningIds.value.has(lendingId);

  const confirmDelete = (lending: Lending) => {
    lendingToDelete.value = lending;
    deleteAlertOpen.value = true;
  };

  const handleDelete = async () => {
    if (!lendingToDelete.value || isDeleting.value) return;

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
    isCreating,
    openLendDialog,
    handleCreate,
    handleReturn,
    isReturning,

    deleteAlertOpen,
    lendingToDelete,
    isDeleting,
    confirmDelete,
    handleDelete,
  };
}
