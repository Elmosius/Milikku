<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';
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
import type { Lending } from '~/types/lending';

const props = defineProps<{
  open: boolean;
  lending: Lending | null;
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
        <div class="flex items-center gap-3">
          <div class="bg-destructive/10 text-destructive rounded-md p-2">
            <AlertTriangle class="h-5 w-5" />
          </div>
          <AlertDialogTitle>Hapus riwayat peminjaman?</AlertDialogTitle>
        </div>
        <AlertDialogDescription>
          Riwayat peminjaman
          <span class="text-foreground font-medium">
            {{ lending?.item?.name || 'barang ini' }}
          </span>
          akan dihapus permanen.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel :disabled="isDeleting">Batal</AlertDialogCancel>
        <Button
          variant="destructive"
          :disabled="isDeleting"
          @click="emit('confirm')"
        >
          {{ isDeleting ? 'Menghapus...' : 'Hapus' }}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
