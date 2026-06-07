import { toast } from 'vue-sonner'
import type { Item } from '~/types/item'
import type { ItemFormValues } from '~/validations/item'
import { useCategories } from '~/composables/useCategories'
import { useLocations } from '~/composables/useLocations'

// Mock data — will be replaced by useFetch('/api/items') once backend is ready
const MOCK_ITEMS: Item[] = [
  {
    id: '1',
    name: 'MacBook Pro M2 14"',
    categoryId: '',
    locationId: '',
    brand: 'Apple',
    model: 'M2 Pro',
    serialNumber: 'C02XXX',
    purchaseDate: '2023-01-15',
    purchasePrice: 32000000,
    condition: 'Bekas (Sangat Baik)',
    status: 'Tersedia',
    quantity: 1,
    isFavorite: true,
    notes: 'Used for daily work.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sony A7IV Camera',
    categoryId: '',
    locationId: '',
    brand: 'Sony',
    model: 'ILCE-7M4',
    purchaseDate: '2022-10-10',
    purchasePrice: 35000000,
    condition: 'Bekas (Baik)',
    status: 'Dipinjamkan',
    quantity: 1,
    isFavorite: false,
    notes: 'Lent to John.',
    createdAt: new Date().toISOString(),
  },
]

let mockIdCounter = 100

export function useItems() {
  const items = ref<Item[]>([...MOCK_ITEMS])
  const pending = ref(false)

  // Simulate network fetch — replace with useFetch('/api/items') later
  const refresh = async () => {
    pending.value = true
    await new Promise(resolve => setTimeout(resolve, 300))
    pending.value = false
  }

  // --- Form state ---
  const formOpen = ref(false)
  const formMode = ref<'create' | 'edit'>('create')
  const selectedItemToEdit = ref<Item | null>(null)

  const openCreateForm = () => {
    formMode.value = 'create'
    selectedItemToEdit.value = null
    formOpen.value = true
  }

  const openEditForm = (item: Item) => {
    formMode.value = 'edit'
    selectedItemToEdit.value = item
    formOpen.value = true
  }

  const handleSubmit = async (values: ItemFormValues) => {
    pending.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      if (formMode.value === 'create') {
        mockIdCounter++
        items.value.push({
          ...values,
          id: String(mockIdCounter),
          createdAt: new Date().toISOString(),
        } as Item)
        toast.success('Item created successfully')
      } else if (selectedItemToEdit.value) {
        const index = items.value.findIndex(i => i.id === selectedItemToEdit.value!.id)
        if (index !== -1) {
          items.value[index] = {
            ...items.value[index],
            ...values,
            updatedAt: new Date().toISOString(),
          }
          toast.success('Item updated successfully')
        }
      }

      formOpen.value = false
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      pending.value = false
    }
  }

  // --- Detail sheet state ---
  const sheetOpen = ref(false)
  const selectedItemToView = ref<Item | null>(null)

  const openDetailSheet = (item: Item) => {
    selectedItemToView.value = item
    sheetOpen.value = true
  }

  const editFromSheet = (item: Item) => {
    sheetOpen.value = false
    openEditForm(item)
  }

  const deleteFromSheet = (item: Item) => {
    sheetOpen.value = false
    confirmDelete(item)
  }

  // --- Delete state ---
  const deleteAlertOpen = ref(false)
  const itemToDelete = ref<Item | null>(null)
  const isDeleting = ref(false)

  const confirmDelete = (item: Item) => {
    itemToDelete.value = item
    deleteAlertOpen.value = true
  }

  const handleDelete = async () => {
    if (!itemToDelete.value) return

    isDeleting.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      items.value = items.value.filter(i => i.id !== itemToDelete.value!.id)
      toast.success('Item deleted successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete item')
    } finally {
      isDeleting.value = false
      deleteAlertOpen.value = false
      itemToDelete.value = null
    }
  }

  // --- Lookup helpers ---
  const { categories } = useCategories()
  const { locations } = useLocations()

  const getCategoryName = (id: string | null | undefined): string => {
    if (!id) return '-'
    return categories.value?.find(c => c.id === id)?.name || '-'
  }

  const getLocationName = (id: string | null | undefined): string => {
    if (!id) return '-'
    return locations.value?.find(l => l.id === id)?.name || '-'
  }

  return {
    // Data
    items,
    pending,
    refresh,

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
    getCategoryName,
    getLocationName,
  }
}
