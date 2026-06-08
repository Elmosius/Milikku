<script setup lang="ts">
import { Bot, Loader2 } from 'lucide-vue-next';
import { VisuallyHidden } from 'radix-vue';
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '~/components/ui/dialog';
import { Textarea } from '~/components/ui/textarea';
import type { ItemFormValues } from '~/validations/item';

const aimoState = useAimoState();
const route = useRoute();

const open = ref(false);
const promptText = ref('');
const isParsing = ref(false);

const handleParseShortcut = (event: KeyboardEvent) => {
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault();
    handleParse();
  }
};

const handleParse = async () => {
  if (!promptText.value.trim()) return;

  isParsing.value = true;
  try {
    const data = await $fetch<Partial<ItemFormValues>>('/api/ai/parse-item', {
      method: 'POST',
      body: { prompt: promptText.value },
    });

    open.value = false;
    promptText.value = '';

    // Store parsed data in global state
    aimoState.value = data;

    // If already on /items page, the watcher in items.vue will handle it.
    // Otherwise, navigate to /items — the page will auto-open the form.
    if (route.path !== '/items') {
      await navigateTo('/items');
    }
  } catch (error: any) {
    toast.error(error.data?.statusMessage || error.message || 'Failed to parse text with AI');
  } finally {
    isParsing.value = false;
  }
};
</script>

<template>
  <div>
    <!-- Floating Action Button (Awwwards Style: Expanding Pill) -->
    <div class="fixed right-6 bottom-6 z-40 flex justify-end">
      <Button
        @click="open = true"
        class="group bg-accent text-background border-border/20 hover:bg-accent flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border p-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:w-32 hover:-translate-y-1"
      >
        <Bot
          class="h-5 w-5 shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:text-white"
        />
        <span
          class="max-w-0 overflow-hidden text-xs font-medium tracking-wide whitespace-nowrap opacity-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:ml-2 group-hover:max-w-xs group-hover:opacity-100"
        >
          Ask Aimo!
        </span>
      </Button>
    </div>

    <!-- AI Input Dialog (Notion / Command Palette style) -->
    <Dialog v-model:open="open">
      <DialogContent class="bg-background border-border/50 gap-0 overflow-hidden p-0 sm:max-w-xl">
        <VisuallyHidden>
          <DialogTitle>AI Assistant Input</DialogTitle>
          <DialogDescription>Type naturally what you bought or own.</DialogDescription>
        </VisuallyHidden>
        <div class="bg-muted/20 border-b p-4">
          <div class="text-foreground mb-2 flex items-center space-x-2">
            <Bot class="text-accent h-5 w-5" />
            <h3 class="font-semibold tracking-tight">Aimo</h3>
          </div>
          <p class="text-muted-foreground text-sm">
            Type naturally what you bought or own. I'll extract the details for you.
          </p>
        </div>

        <div class="p-4">
          <Textarea
            v-model="promptText"
            placeholder="e.g. 'Baru beli MacBook Pro M3 kemarin di iBox harganya 25 juta. Garansi setahun.'"
            class="placeholder:text-muted-foreground/60 min-h-32 resize-none border-0 bg-transparent px-0 text-base focus-visible:ring-0"
            @keydown.enter="handleParseShortcut"
          />
        </div>

        <div class="bg-muted/10 flex items-center justify-between border-t p-4">
          <span class="text-muted-foreground hidden text-xs sm:inline-block">
            Press
            <kbd
              class="bg-muted border-border/50 rounded-md border px-1.5 py-0.5 font-sans text-[10px] font-medium"
              >Cmd</kbd
            >
            +
            <kbd
              class="bg-muted border-border/50 rounded-md border px-1.5 py-0.5 font-sans text-[10px] font-medium"
              >Enter</kbd
            >
            to submit
          </span>
          <span class="sm:hidden"></span>

          <div class="flex space-x-2">
            <Button
              variant="ghost"
              @click="open = false"
              :disabled="isParsing"
              class="hover:bg-muted/50"
            >
              Cancel
            </Button>
            <Button @click="handleParse" :disabled="!promptText.trim() || isParsing">
              <Loader2 v-if="isParsing" class="mr-2 h-4 w-4 animate-spin" />
              {{ isParsing ? 'Thinking...' : 'Extract Data' }}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
