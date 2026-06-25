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
import type { Location } from '~/types/location';

const props = defineProps<{
  open: boolean;
  location: Location | null;
  isDeleting: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'confirm'): void;
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
          This action cannot be undone. This will permanently delete the location "<span
            class="text-foreground font-medium"
            >{{ location?.name }}</span
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
