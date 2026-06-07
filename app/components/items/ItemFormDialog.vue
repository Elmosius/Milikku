<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { itemSchema } from '~/validations/item'
import type { ItemFormValues } from '~/validations/item'
import { ITEM_CONDITIONS, ITEM_STATUSES } from '~/constants/item'
import { useCategories } from '~/composables/useCategories'
import { useLocations } from '~/composables/useLocations'
import type { Item } from '~/types/item'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Textarea } from '~/components/ui/textarea'
import { Checkbox } from '~/components/ui/checkbox'

const props = defineProps<{
  open: boolean
  mode: 'create' | 'edit'
  item: Item | null
}>()

const emit = defineEmits<{
  'update:open': [val: boolean]
  submit: [values: ItemFormValues]
}>()

const formSchema = toTypedSchema(itemSchema)
const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: {
    quantity: 1,
    isFavorite: false,
  },
})

const { categories } = useCategories()
const { locations } = useLocations()

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    if (props.mode === 'edit' && props.item) {
      setValues({
        name: props.item.name,
        categoryId: props.item.categoryId || undefined,
        locationId: props.item.locationId || undefined,
        brand: props.item.brand,
        model: props.item.model,
        serialNumber: props.item.serialNumber,
        purchaseDate: props.item.purchaseDate,
        purchasePrice: props.item.purchasePrice,
        purchaseLocation: props.item.purchaseLocation,
        warrantyExpiry: props.item.warrantyExpiry,
        condition: props.item.condition,
        status: props.item.status,
        notes: props.item.notes,
        quantity: props.item.quantity,
        isFavorite: props.item.isFavorite,
      })
    } else {
      resetForm()
    }
  }
})

const onSubmit = handleSubmit((values) => {
  emit('submit', values as ItemFormValues)
  emit('update:open', false)
})
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-3xl p-0">
      <DialogHeader class="px-6 py-4 border-b">
        <DialogTitle>{{ mode === 'create' ? 'Add New Item' : 'Edit Item' }}</DialogTitle>
      </DialogHeader>

      <ScrollArea class="max-h-[80vh] w-full">
        <form @submit="onSubmit" class="p-6 space-y-6 w-full">

          <!-- Basic Info -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium">Basic Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <FormField v-slot="{ componentField }" name="name">
                <FormItem class="relative pb-4">
                  <FormLabel>Name <span class="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="MacBook Pro..." v-bind="componentField" />
                  </FormControl>
                  <FormMessage class="absolute bottom-0 left-0 text-xs" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="quantity">
                <FormItem class="relative pb-4">
                  <FormLabel>Quantity <span class="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input class="w-full" type="number" min="1" v-bind="componentField" />
                  </FormControl>
                  <FormMessage class="absolute bottom-0 left-0 text-xs" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="categoryId">
                <FormItem class="relative pb-4">
                  <FormLabel>Category <span class="text-destructive">*</span></FormLabel>
                  <Select v-bind="componentField">
                    <FormControl>
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage class="absolute bottom-0 left-0 text-xs" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="locationId">
                <FormItem class="relative pb-4">
                  <FormLabel>Location <span class="text-destructive">*</span></FormLabel>
                  <Select v-bind="componentField">
                    <FormControl>
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="l in locations" :key="l.id" :value="l.id">{{ l.name }}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage class="absolute bottom-0 left-0 text-xs" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="status">
                <FormItem class="relative pb-4">
                  <FormLabel>Status</FormLabel>
                  <Select v-bind="componentField">
                    <FormControl>
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="s in ITEM_STATUSES" :key="s" :value="s">{{ s }}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage class="absolute bottom-0 left-0 text-xs" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="condition">
                <FormItem class="relative pb-4">
                  <FormLabel>Condition</FormLabel>
                  <Select v-bind="componentField">
                    <FormControl>
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="c in ITEM_CONDITIONS" :key="c" :value="c">{{ c }}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage class="absolute bottom-0 left-0 text-xs" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ handleChange }" name="photoUrl">
                <FormItem class="col-span-1 md:col-span-2 relative pb-4">
                  <FormLabel>Photo Item</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" @change="(e: Event) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleChange(file.name);
                    }" />
                  </FormControl>
                  <FormMessage class="absolute bottom-0 left-0 text-xs" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ value, handleChange }" name="isFavorite" type="checkbox">
                <FormItem class="col-span-1 md:col-span-2 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox :checked="value" @update:checked="handleChange" />
                  </FormControl>
                  <div class="space-y-1 leading-none">
                    <FormLabel>Mark as Favorite</FormLabel>
                  </div>
                </FormItem>
              </FormField>
            </div>
          </div>

          <!-- Details -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium">Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <FormField v-slot="{ componentField }" name="brand">
                <FormItem class="relative pb-4">
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="Apple, Sony..." v-bind="componentField" />
                  </FormControl>
                  <FormMessage class="absolute bottom-0 left-0 text-xs" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="model">
                <FormItem class="relative pb-4">
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="M2 Pro..." v-bind="componentField" />
                  </FormControl>
                  <FormMessage class="absolute bottom-0 left-0 text-xs" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="serialNumber">
                <FormItem class="relative pb-4">
                  <FormLabel>Serial Number</FormLabel>
                  <FormControl>
                    <Input placeholder="SN123456..." v-bind="componentField" />
                  </FormControl>
                  <FormMessage class="absolute bottom-0 left-0 text-xs" />
                </FormItem>
              </FormField>
            </div>
          </div>

          <!-- Purchase & Warranty -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium">Purchase & Warranty</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <FormField v-slot="{ componentField }" name="purchasePrice">
                <FormItem class="relative pb-4">
                  <FormLabel>Purchase Price</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="0" v-bind="componentField" />
                  </FormControl>
                  <FormMessage class="absolute bottom-0 left-0 text-xs" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="purchaseDate">
                <FormItem class="relative pb-4">
                  <FormLabel>Purchase Date</FormLabel>
                  <FormControl>
                    <Input type="date" v-bind="componentField" />
                  </FormControl>
                  <FormMessage class="absolute bottom-0 left-0 text-xs" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="purchaseLocation">
                <FormItem class="relative pb-4">
                  <FormLabel>Purchase Location</FormLabel>
                  <FormControl>
                    <Input placeholder="iBox Store..." v-bind="componentField" />
                  </FormControl>
                  <FormMessage class="absolute bottom-0 left-0 text-xs" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="warrantyExpiry">
                <FormItem class="relative pb-4">
                  <FormLabel>Warranty Expiry</FormLabel>
                  <FormControl>
                    <Input type="date" v-bind="componentField" />
                  </FormControl>
                  <FormMessage class="absolute bottom-0 left-0 text-xs" />
                </FormItem>
              </FormField>
            </div>
          </div>

          <FormField v-slot="{ componentField }" name="notes">
            <FormItem class="relative pb-4">
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Any additional details..." class="resize-none" v-bind="componentField" />
              </FormControl>
              <FormMessage class="absolute bottom-0 left-0 text-xs" />
            </FormItem>
          </FormField>

          <div class="flex justify-end gap-4 pb-4">
            <Button type="button" variant="outline" @click="emit('update:open', false)">Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </ScrollArea>
    </DialogContent>
  </Dialog>
</template>
