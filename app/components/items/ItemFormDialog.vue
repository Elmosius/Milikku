<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { onUnmounted, ref, watch } from 'vue';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { ScrollArea } from '~/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { useCategories } from '~/composables/useCategories';
import { useLocations } from '~/composables/useLocations';
import { ITEM_CONDITIONS, ITEM_STATUSES } from '~/constants/item';
import type { Item } from '~/types/item';
import type { ItemFormValues } from '~/validations/item';
import { itemSchema } from '~/validations/item';

const props = defineProps<{
  open: boolean;
  mode: 'create' | 'edit';
  item: Item | null;
}>();

const emit = defineEmits<{
  'update:open': [val: boolean];
  submit: [values: ItemFormValues, photoFile: File | null];
}>();

const selectedPhotoFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);

onUnmounted(() => {
  if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value);
  }
});

const formSchema = toTypedSchema(itemSchema);
const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: {
    quantity: 1,
    isFavorite: false,
  },
});

const { categories } = useCategories();
const { locations } = useLocations();

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      selectedPhotoFile.value = null;
      if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl.value);
      }
      previewUrl.value = props.mode === 'edit' && props.item?.photoUrl ? props.item.photoUrl : null;

      if (props.mode === 'edit' && props.item) {
        setValues({
          name: props.item.name,
          categoryId: props.item.categoryId || undefined,
          locationId: props.item.locationId || undefined,
          brand: props.item.brand,
          model: props.item.model,
          serialNumber: props.item.serialNumber,
          purchaseDate: props.item.purchaseDate,
          purchasePrice:
            props.item.purchasePrice == null || props.item.purchasePrice === ''
              ? undefined
              : Number(props.item.purchasePrice),
          purchaseLocation: props.item.purchaseLocation,
          warrantyExpiry: props.item.warrantyExpiry,
          condition: props.item.condition,
          status: props.item.status,
          notes: props.item.notes,
          quantity: props.item.quantity,
          isFavorite: props.item.isFavorite,
        });
      } else {
        resetForm();
      }
    }
  },
);

const onSubmit = handleSubmit((values) => {
  emit('submit', values as ItemFormValues, selectedPhotoFile.value);
});

const formatPriceInput = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') return '';
  const num =
    typeof value === 'number' ? value : parseInt(value.toString().replace(/[^0-9]/g, ''), 10);
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const handlePriceInput = (e: Event, handleChange: (val: any) => void) => {
  const target = e.target as HTMLInputElement;
  const rawValue = target.value;

  const selectionStart = target.selectionStart || 0;
  const oldLength = rawValue.length;

  const numericValue = rawValue.replace(/[^0-9]/g, '');
  const num = numericValue ? parseInt(numericValue, 10) : undefined;

  handleChange(num);

  const formattedValue = formatPriceInput(num);
  target.value = formattedValue;

  const newLength = formattedValue.length;
  const lengthDiff = newLength - oldLength;

  let newSelectionStart = selectionStart + lengthDiff;
  newSelectionStart = Math.max(0, Math.min(newSelectionStart, newLength));

  target.setSelectionRange(newSelectionStart, newSelectionStart);
};

const handleFileChange = (e: Event, handleChange: (val: any) => void) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    selectedPhotoFile.value = file;
    handleChange(file.name);
    if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl.value);
    }
    previewUrl.value = URL.createObjectURL(file);
  }
};
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="p-0 sm:max-w-3xl">
      <DialogHeader class="border-b px-6 py-4">
        <DialogTitle>{{ mode === 'create' ? 'Add New Item' : 'Edit Item' }}</DialogTitle>
      </DialogHeader>

      <ScrollArea class="max-h-[80vh] w-full">
        <form @submit="onSubmit" class="w-full space-y-6 p-6">
          <!-- Basic Info -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium">Basic Information</h3>
            <div class="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
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
                        <SelectItem v-for="c in categories" :key="c.id" :value="c.id">{{
                          c.name
                        }}</SelectItem>
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
                        <SelectItem v-for="l in locations" :key="l.id" :value="l.id">{{
                          l.name
                        }}</SelectItem>
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
                        <SelectItem v-for="s in ITEM_STATUSES" :key="s" :value="s">{{
                          s
                        }}</SelectItem>
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
                        <SelectItem v-for="c in ITEM_CONDITIONS" :key="c" :value="c">{{
                          c
                        }}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage class="absolute bottom-0 left-0 text-xs" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ handleChange }" name="photoUrl">
                <FormItem class="relative col-span-1 pb-4 md:col-span-2">
                  <FormLabel>Photo Item</FormLabel>
                  <div class="mt-2 flex items-center gap-4">
                    <div
                      v-if="previewUrl"
                      class="border-border bg-muted h-16 w-16 shrink-0 overflow-hidden rounded-md border"
                    >
                      <img
                        :src="previewUrl"
                        alt="Item Preview"
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        @change="(e: Event) => handleFileChange(e, handleChange)"
                      />
                    </FormControl>
                  </div>
                  <FormMessage class="absolute bottom-0 left-0 text-xs" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ value, handleChange }" name="isFavorite" type="checkbox">
                <FormItem
                  class="col-span-1 flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4 md:col-span-2"
                >
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
            <div class="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
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
            <div class="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
              <FormField v-slot="{ value, handleChange }" name="purchasePrice">
                <FormItem class="relative pb-4">
                  <FormLabel>Purchase Price</FormLabel>
                  <FormControl>
                    <div class="relative flex items-center">
                      <span class="text-muted-foreground absolute left-3 text-sm">Rp</span>
                      <Input
                        type="text"
                        inputmode="numeric"
                        class="pl-9"
                        placeholder="0"
                        :value="formatPriceInput(value)"
                        @input="(e: Event) => handlePriceInput(e, handleChange)"
                      />
                    </div>
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
                <Textarea
                  placeholder="Any additional details..."
                  class="resize-none"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage class="absolute bottom-0 left-0 text-xs" />
            </FormItem>
          </FormField>

          <div class="flex justify-end gap-4 pb-4">
            <Button type="button" variant="outline" @click="emit('update:open', false)"
              >Cancel</Button
            >
            <Button type="submit">Save</Button>
          </div>
        </form>
      </ScrollArea>
    </DialogContent>
  </Dialog>
</template>
