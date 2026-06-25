<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { watch } from 'vue';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import type { Item } from '~/types/item';
import type { LendingFormValues } from '~/validations/lending';
import { lendingSchema } from '~/validations/lending';

const props = defineProps<{
  open: boolean;
  itemId?: string | null;
  items?: Item[];
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  'update:open': [val: boolean];
  submit: [values: LendingFormValues];
}>();

const formSchema = toTypedSchema(lendingSchema);
const { handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    lentAt: new Date().toISOString().split('T')[0],
  },
});

watch(
  () => [props.open, props.itemId],
  ([isOpen]) => {
    if (isOpen) {
      resetForm();
      if (props.itemId) {
        setFieldValue('itemId', props.itemId);
      }
      setFieldValue('lentAt', new Date().toISOString().split('T')[0]);
    }
  },
);

const onSubmit = handleSubmit((values) => {
  if (props.isSubmitting) return;
  emit('submit', values as LendingFormValues);
});

const handleOpenChange = (value: boolean) => {
  if (props.isSubmitting && !value) return;
  emit('update:open', value);
};
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Lend Item</DialogTitle>
      </DialogHeader>

      <form @submit="onSubmit" class="space-y-4">
        <FormField v-if="!itemId && items?.length" v-slot="{ componentField }" name="itemId">
          <FormItem class="relative pb-4">
            <FormLabel>Item <span class="text-destructive">*</span></FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select an item..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="item in items" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage class="absolute bottom-0 left-0 text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="borrowerName">
          <FormItem class="relative pb-4">
            <FormLabel>Borrower Name <span class="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Enter borrower name..." v-bind="componentField" />
            </FormControl>
            <FormMessage class="absolute bottom-0 left-0 text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="borrowerContact">
          <FormItem class="relative pb-4">
            <FormLabel>Contact (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Phone / Email..." v-bind="componentField" />
            </FormControl>
            <FormMessage class="absolute bottom-0 left-0 text-xs" />
          </FormItem>
        </FormField>

        <div class="grid grid-cols-2 gap-4">
          <FormField v-slot="{ componentField }" name="lentAt">
            <FormItem class="relative pb-4">
              <FormLabel>Lend Date <span class="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input type="date" v-bind="componentField" />
              </FormControl>
              <FormMessage class="absolute bottom-0 left-0 text-xs" />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="expectedReturnAt">
            <FormItem class="relative pb-4">
              <FormLabel>Expected Return</FormLabel>
              <FormControl>
                <Input type="date" v-bind="componentField" />
              </FormControl>
              <FormMessage class="absolute -bottom-5 left-0 text-xs" />
            </FormItem>
          </FormField>
        </div>

        <FormField v-slot="{ componentField }" name="notes">
          <FormItem class="relative pb-4">
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea placeholder="Additional notes..." class="resize-none" v-bind="componentField" />
            </FormControl>
            <FormMessage class="absolute bottom-0 left-0 text-xs" />
          </FormItem>
        </FormField>

        <div class="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            :disabled="isSubmitting"
            @click="handleOpenChange(false)"
          >
            Cancel
          </Button>
          <Button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Lending...' : 'Lend' }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
