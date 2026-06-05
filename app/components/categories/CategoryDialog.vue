<script setup lang="ts">
import { watch } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { categorySchema } from '~/validations/category'
import type { CategorySchema } from '~/validations/category'
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
import { 
  Home, Briefcase, ShoppingBag, Gamepad2, Laptop, Smartphone, 
  Book, Car, Plane, Coffee, Shirt, Camera, Folder, Heart, Star, Music, Video, MapPin, Gift
} from 'lucide-vue-next'

const availableIcons = [
  { name: 'Folder', component: Folder },
  { name: 'Home', component: Home },
  { name: 'Briefcase', component: Briefcase },
  { name: 'ShoppingBag', component: ShoppingBag },
  { name: 'Gamepad2', component: Gamepad2 },
  { name: 'Laptop', component: Laptop },
  { name: 'Smartphone', component: Smartphone },
  { name: 'Book', component: Book },
  { name: 'Car', component: Car },
  { name: 'Plane', component: Plane },
  { name: 'Coffee', component: Coffee },
  { name: 'Shirt', component: Shirt },
  { name: 'Camera', component: Camera },
  { name: 'Heart', component: Heart },
  { name: 'Star', component: Star },
  { name: 'Music', component: Music },
  { name: 'Video', component: Video },
  { name: 'MapPin', component: MapPin },
  { name: 'Gift', component: Gift },
]
const props = defineProps<{
  open: boolean
  mode: 'create' | 'edit'
  category?: { id: number; name: string; icon?: string | null; color?: string | null } | null
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}>()

const formSchema = toTypedSchema(categorySchema)

const { handleSubmit, setValues, resetForm, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: '',
    icon: 'Folder',
    color: '#EF6351',
  },
})

// Initialize form when opening dialog or mode/category changes
watch(() => [props.open, props.category], ([isOpen]) => {
  if (isOpen) {
    if (props.mode === 'edit' && props.category) {
      setValues({ 
        name: props.category.name,
        icon: props.category.icon || undefined,
        color: props.category.color || undefined,
      })
    } else {
      resetForm()
    }
  }
})

const onSubmit = handleSubmit(async (values: CategorySchema) => {
  try {
    const url = props.mode === 'edit' && props.category 
      ? `/api/categories/${props.category.id}` 
      : '/api/categories'
      
    const method = props.mode === 'edit' ? 'PUT' : 'POST'

    await $fetch(url, {
      method,
      body: values,
    })

    toast.success(props.mode === 'edit' ? 'Category updated successfully' : 'Category created successfully')
    
    // Close the dialog FIRST to avoid Radix Vue focus-trap issues when background DOM changes
    emit('update:open', false)
    
    // Then tell the parent to refetch data after dialog has started closing
    setTimeout(() => {
      emit('success')
    }, 150)
    
  } catch (error: any) {
    console.error("Form Submission Error:", error)
    toast.error(error.message || 'An error occurred')
    // Attempt to close modal even on error if it was a success but toast failed
    if (error.message && !error.message.includes('fetch')) {
      emit('update:open', false)
    }
  }
})
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ mode === 'edit' ? 'Edit Category' : 'Add Category' }}</DialogTitle>
        <DialogDescription>
          {{ mode === 'edit' ? 'Update the category details.' : 'Add a new category to organize your assets.' }}
        </DialogDescription>
      </DialogHeader>
      
      <form @submit="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="e.g. Electronics" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        
        <div class="space-y-4">
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
          
          <FormField v-slot="{ componentField }" name="color">
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Input type="color" class="h-10 w-full cursor-pointer p-1" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        
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
