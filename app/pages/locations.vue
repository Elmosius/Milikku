<script setup lang="ts">
import { useLocations } from '~/composables/useLocations';
import LocationsHeader from '~/components/locations/LocationsHeader.vue';
import LocationsTable from '~/components/locations/LocationsTable.vue';
import LocationDialog from '~/components/locations/LocationDialog.vue';
import DeleteLocationDialog from '~/components/locations/DeleteLocationDialog.vue';

const {
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
} = useLocations();
</script>

<template>
  <div class="flex flex-1 flex-col gap-4">
    <LocationsHeader @create="openCreateDialog" />

    <LocationsTable
      :locations="locations ?? []"
      :pending="pending"
      @edit="openEditDialog"
      @delete="confirmDelete"
    />

    <LocationDialog
      v-model:open="dialogOpen"
      :mode="dialogMode"
      :location="selectedLocation"
      @success="refresh"
    />

    <DeleteLocationDialog
      :open="deleteAlertOpen"
      :location="locationToDelete"
      :is-deleting="isDeleting"
      @update:open="deleteAlertOpen = $event"
      @confirm="handleDelete"
    />
  </div>
</template>
