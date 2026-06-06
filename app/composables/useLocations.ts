import { ref } from 'vue'
import { toast } from 'vue-sonner'
import type { Location } from '~/types/location'

export function useLocations() {
  // MOCK DATA
  const locations = ref<Location[]>([
    { id: '1', name: 'Ruang Tamu', description: 'Area ruang tamu utama', icon: 'Home', createdAt: new Date().toISOString() },
    { id: '2', name: 'Gudang', description: 'Gudang belakang untuk barang tidak terpakai', icon: 'Folder', createdAt: new Date().toISOString() },
  ])
  const pending = ref(false)

  const refresh = async () => {
    pending.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    pending.value = false
  }

  const dialogOpen = ref(false)
  const dialogMode = ref<'create' | 'edit'>('create')
  const selectedLocation = ref<Location | null>(null)

  const deleteAlertOpen = ref(false)
  const locationToDelete = ref<Location | null>(null)
  const isDeleting = ref(false)

  const openCreateDialog = () => {
    dialogMode.value = 'create'
    selectedLocation.value = null
    dialogOpen.value = true
  }

  const openEditDialog = (location: Location) => {
    dialogMode.value = 'edit'
    selectedLocation.value = location
    dialogOpen.value = true
  }

  const confirmDelete = (location: Location) => {
    locationToDelete.value = location
    deleteAlertOpen.value = true
  }

  const handleDelete = async () => {
    if (!locationToDelete.value) return
    isDeleting.value = true
    await new Promise(resolve => setTimeout(resolve, 500)) 
    locations.value = locations.value.filter(loc => loc.id !== locationToDelete.value?.id)
    toast.success('Location deleted successfully')
    isDeleting.value = false
    deleteAlertOpen.value = false
    locationToDelete.value = null
  }

  return { locations, pending, refresh, dialogOpen, dialogMode, selectedLocation, deleteAlertOpen, locationToDelete, isDeleting, openCreateDialog, openEditDialog, confirmDelete, handleDelete }
}
