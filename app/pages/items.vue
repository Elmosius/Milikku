<script setup lang="ts">
import { useItems } from '~/composables/useItems';
import ItemsHeader from '~/components/items/ItemsHeader.vue';
import ItemsTable from '~/components/items/ItemsTable.vue';
import ItemDetailSheet from '~/components/items/ItemDetailSheet.vue';
import ItemFormDialog from '~/components/items/ItemFormDialog.vue';
import DeleteItemDialog from '~/components/items/DeleteItemDialog.vue';

const {
  items,
  pending,
  formOpen,
  formMode,
  selectedItemToEdit,
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
  getCategory,
  getLocation,
} = useItems();
</script>

<template>
  <div class="flex flex-1 flex-col gap-4">
    <ItemsHeader @create="openCreateForm" />

    <ItemsTable
      :items="items"
      :pending="pending"
      :get-category="getCategory"
      :get-location="getLocation"
      @view="openDetailSheet"
      @edit="openEditForm"
      @delete="confirmDelete"
    />

    <ItemFormDialog
      v-model:open="formOpen"
      :mode="formMode"
      :item="selectedItemToEdit"
      @submit="handleSubmit"
    />

    <ItemDetailSheet
      v-model:open="sheetOpen"
      :item="selectedItemToView"
      :get-category="getCategory"
      :get-location="getLocation"
      @edit="editFromSheet"
      @delete="deleteFromSheet"
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
