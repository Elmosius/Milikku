<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import { Button } from '~/components/ui/button';
import type { Item } from '~/types/item';

const props = defineProps<{
  open: boolean;
  item: Item | null;
  isDeleting: boolean;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  confirm: [];
}>();

const handleOpenChange = (value: boolean) => {
  if (props.isDeleting && !value) return;
  emit('update:open', value);
};
</script>

<template>
  <AlertDialog :open="open" @update:open="handleOpenChange">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the item "<span
            class="text-foreground font-medium"
            >{{ item?.name }}</span
          >".
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel :disabled="isDeleting">Cancel</AlertDialogCancel>
        <Button
          variant="destructive"
          :disabled="isDeleting"
          @click="emit('confirm')"
        >
          {{ isDeleting ? 'Deleting...' : 'Delete' }}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
