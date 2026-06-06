<script setup lang="ts">
import { useCategories } from '~/composables/useCategories'
import CategoriesHeader from '~/components/categories/CategoriesHeader.vue'
import CategoriesTable from '~/components/categories/CategoriesTable.vue'
import CategoryDialog from '~/components/categories/CategoryDialog.vue'
import DeleteCategoryDialog from '~/components/categories/DeleteCategoryDialog.vue'

const {
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
} = useCategories()
</script>

<template>
  <div class="flex flex-1 flex-col gap-4">
    <CategoriesHeader @create="openCreateDialog" />

    <CategoriesTable
      :categories="categories ?? []"
      :pending="pending"
      @edit="openEditDialog"
      @delete="confirmDelete"
    />

    <CategoryDialog
      v-model:open="dialogOpen"
      :mode="dialogMode"
      :category="selectedCategory"
      @success="refresh"
    />

    <DeleteCategoryDialog
      :open="deleteAlertOpen"
      :category="categoryToDelete"
      :is-deleting="isDeleting"
      @update:open="deleteAlertOpen = $event"
      @confirm="handleDelete"
    />
  </div>
</template>
