<script setup lang="ts">
import { watch } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { locationSchema } from '~/validations/location'
import type { LocationSchema } from '~/validations/location'
import { toast } from 'vue-sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { locationIcons as availableIcons } from '~/constants/locationIcons'

const props = defineProps<{
  open: boolean
  mode: 'create' | 'edit'
  location?: { id: string; name: string; description?: string | null; icon?: string | null } | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}>()

const formSchema = toTypedSchema(locationSchema)

const { handleSubmit, setValues, resetForm, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: '',
    description: '',
    icon: 'Home',
  },
})

// Initialize form when opening dialog or mode/location changes
watch(() => [props.open, props.location], ([isOpen]) => {
  if (isOpen) {
    if (props.mode === 'edit' && props.location) {
      setValues({ 
        name: props.location.name,
        description: props.location.description || '',
        icon: props.location.icon || undefined,
      })
    } else {
      resetForm()
    }
  }
})

const onSubmit = handleSubmit(async (values: LocationSchema) => {
  try {
    // Simulate delay
    await new Promise(r => setTimeout(r, 500))

    toast.success(props.mode === 'edit' ? 'Location updated successfully' : 'Location created successfully')
    
    // Close the dialog FIRST
    emit('update:open', false)
    
    // Tell parent to refetch
    setTimeout(() => {
      emit('success')
    }, 150)
    
  } catch (error: any) {
    toast.error(error.message || 'An error occurred')
  }
})
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ mode === 'edit' ? 'Edit Location' : 'Add Location' }}</DialogTitle>
        <DialogDescription>
          {{ mode === 'edit' ? 'Update the location details.' : 'Add a new location to organize your assets.' }}
        </DialogDescription>
      </DialogHeader>
      
      <form @submit="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="e.g. Living Room" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        
        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <textarea 
                v-bind="componentField"
                placeholder="Optional description" 
                class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              ></textarea>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        
        <FormField v-slot="{ value, handleChange }" name="icon">
          <FormItem>
            <FormLabel>Icon</FormLabel>
            <FormControl>
              <div class="flex flex-wrap gap-2">
                <button 
                  v-for="icon in availableIcons" 
                  :key="icon.name"
                  type="button"
                  class="flex h-10 w-10 items-center justify-center rounded-md border transition-all hover:bg-muted"
                  :class="value === icon.name ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-background text-muted-foreground'"
                  @click="handleChange(icon.name)"
                >
                  <component :is="icon.component" class="h-5 w-5" stroke-width="1.5" />
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        
        <DialogFooter>
          <Button type="button" variant="outline" @click="$emit('update:open', false)" :disabled="isSubmitting">
            Cancel
          </Button>
          <Button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Create') }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
