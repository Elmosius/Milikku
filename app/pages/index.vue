<script setup lang="ts">
// Dashboard logic will go here
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Quick Stats Placeholders -->
    <div class="grid auto-rows-min gap-4 md:grid-cols-3">
      <div class="bg-card hover:bg-muted/20 rounded-xl border p-6 transition-all">
        <h3 class="text-muted-foreground text-sm font-medium tracking-wide">Total Items</h3>
        <p class="text-foreground mt-2 text-xl font-bold">0</p>
      </div>
      <div class="bg-card hover:bg-muted/20 rounded-xl border p-6 transition-all">
        <h3 class="text-muted-foreground text-sm font-medium tracking-wide">Total Value</h3>
        <p class="text-foreground mt-2 text-xl font-bold">Rp 0</p>
      </div>
      <div class="bg-card hover:bg-muted/20 rounded-xl border p-6 transition-all">
        <h3 class="text-muted-foreground text-sm font-medium tracking-wide">Categories</h3>
        <p class="text-foreground mt-2 text-xl font-bold">0</p>
      </div>
    </div>

    <!-- Main Chart/Content Area Placeholder -->
    <div
      class="bg-card flex min-h-[50vh] flex-1 flex-col items-center justify-center rounded-xl border p-6 md:min-h-min"
    >
      <p class="text-muted-foreground text-center text-sm">
        Grafik dan data aktivitas akan tampil di sini
      </p>
    </div>
  </div>
</template>
