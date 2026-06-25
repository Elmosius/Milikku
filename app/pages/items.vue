<script setup lang="ts">
import { useItems } from '~/composables/useItems';
import ItemsHeader from '~/components/items/ItemsHeader.vue';
import ItemsFilterBar from '~/components/items/ItemsFilterBar.vue';
import ItemsTable from '~/components/items/ItemsTable.vue';
import ItemDetailSheet from '~/components/items/ItemDetailSheet.vue';
import ItemFormDialog from '~/components/items/ItemFormDialog.vue';
import DeleteItemDialog from '~/components/items/DeleteItemDialog.vue';

const {
  items,
  pagination,
  pending,
  queryParams,
  formOpen,
  formMode,
  selectedItemToEdit,
  initialCreateData,
  isSaving,
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
  isFavoriteUpdating,
  getCategory,
  getLocation,
} = useItems();
const route = useRoute();

// Watch for Aimo global state — auto-open create form when Aimo parses data
const aimoState = useAimoState();

const processAimoData = () => {
  if (aimoState.value) {
    const data = aimoState.value;
    aimoState.value = null; // Clear state so form doesn't re-open
    // Small delay to let the page render first
    setTimeout(() => {
      openCreateForm(data);
    }, 100);
  }
};

onMounted(processAimoData);
watch(aimoState, processAimoData);

const openItemFromQuery = async () => {
  const itemId = typeof route.query.item === 'string' ? route.query.item : null;
  if (!itemId || selectedItemToView.value?.id === itemId) return;

  try {
    const item = await $fetch(`/api/items/${itemId}`);
    openDetailSheet(item);
  } catch {
    // The reminder may have become stale because the item was removed.
  }
};

onMounted(openItemFromQuery);
watch(() => route.query.item, openItemFromQuery);
</script>

<template>
  <div class="flex flex-1 flex-col gap-4">
    <ItemsHeader @create="() => openCreateForm()" />

    <ItemsFilterBar :query-params="queryParams" />

    <ItemsTable
      :items="items"
      :pending="pending"
      :pagination="pagination"
      :get-category="getCategory"
      :get-location="getLocation"
      @view="openDetailSheet"
      @edit="openEditForm"
      @delete="confirmDelete"
      @toggle-favorite="toggleFavorite"
      :is-favorite-updating="isFavoriteUpdating"
      @change-page="queryParams.page = $event"
      @change-limit="queryParams.limit = $event"
    />

    <ItemFormDialog
      v-model:open="formOpen"
      :mode="formMode"
      :item="selectedItemToEdit"
      :initial-data="initialCreateData"
      :is-submitting="isSaving"
      @submit="handleSubmit"
    />

    <ItemDetailSheet
      v-model:open="sheetOpen"
      :item="selectedItemToView"
      :get-category="getCategory"
      :get-location="getLocation"
      @edit="editFromSheet"
      @delete="deleteFromSheet"
      @toggle-favorite="toggleFavorite"
    />

    <DeleteItemDialog
      :open="deleteAlertOpen"
      :item="itemToDelete"
      :is-deleting="isDeleting"
      @update:open="deleteAlertOpen = $event"
      @confirm="handleDelete"
    />
  </div>
</template>
