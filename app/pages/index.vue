<script setup lang="ts">
import { useFetch } from '#app';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Donut, StackedBar } from '@unovis/ts';
import { VisAxis, VisDonut, VisSingleContainer, VisStackedBar, VisXYContainer, VisTooltip, VisCrosshair } from '@unovis/vue';
import { DollarSign, MapPin, Package, Tag } from 'lucide-vue-next';

const { data: dashboard, pending } = useFetch('/api/dashboard');

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatCurrencyShort = (value: number) => {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)}M`; // Milyar
  } else if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)}Jt`; // Juta
  } else if (value >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(0)}Rb`; // Ribu
  }
  return `Rp ${value}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getStatusBadgeVariant = (status: string | null) => {
  switch (status) {
    case 'Active':
      return 'default';
    case 'In Use':
      return 'secondary';
    case 'Maintenance':
      return 'outline';
    case 'Missing':
    case 'Retired':
    case 'Sold':
      return 'destructive';
    default:
      return 'outline';
  }
};

// Colors for donut chart
const donutColors = ['#f15844', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#06b6d4'];
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-foreground text-3xl font-bold tracking-tight">Dashboard</h1>
    </div>

    <!-- Quick Stats -->
    <div v-if="pending" class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="i in 4" :key="i" class="animate-pulse">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <div class="bg-muted h-4 w-24 rounded"></div>
          <div class="bg-muted h-4 w-4 rounded"></div>
        </CardHeader>
        <CardContent>
          <div class="bg-muted mt-2 h-8 w-16 rounded"></div>
        </CardContent>
      </Card>
    </div>

    <div v-else-if="dashboard" class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <!-- Total Items -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Items</CardTitle>
          <Package class="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ dashboard.totalItems }}</div>
          <p class="text-muted-foreground mt-1 text-xs">Physical units in inventory</p>
        </CardContent>
      </Card>

      <!-- Total Value -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Asset Value</CardTitle>
          <DollarSign class="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ formatCurrency(dashboard.totalValue) }}</div>
          <p class="text-muted-foreground mt-1 text-xs">Based on purchase prices</p>
        </CardContent>
      </Card>

      <!-- Total Categories -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Categories</CardTitle>
          <Tag class="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ dashboard.totalCategories }}</div>
          <p class="text-muted-foreground mt-1 text-xs">Active categories</p>
        </CardContent>
      </Card>

      <!-- Total Locations -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Locations</CardTitle>
          <MapPin class="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ dashboard.totalLocations }}</div>
          <p class="text-muted-foreground mt-1 text-xs">Storage locations</p>
        </CardContent>
      </Card>
    </div>

    <!-- Charts Section -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7" v-if="dashboard">
      <!-- Donut Chart: Items by Category -->
      <Card class="col-span-full lg:col-span-3">
        <CardHeader>
          <CardTitle>Items by Category</CardTitle>
          <CardDescription>Distribution of inventory units across categories</CardDescription>
        </CardHeader>
        <CardContent class="h-[350px]">
          <div
            v-if="dashboard.itemsByCategory.length === 0"
            class="text-muted-foreground flex h-full items-center justify-center"
          >
            No data available
          </div>
          <VisSingleContainer v-else :data="dashboard.itemsByCategory" class="h-full w-full">
            <VisTooltip
              :triggers="{
                [Donut.selectors.segment]: (d: any) => `<b>${d.data.name}</b>: ${d.data.value} items`
              }"
            />
            <VisDonut
              :value="(d: any) => d.value"
              :color="(d: any, i: number) => donutColors[i % donutColors.length]"
              :arcWidth="50"
              :showEmptySegments="true"
            />
          </VisSingleContainer>
        </CardContent>
      </Card>

      <!-- Bar Chart: Value by Location -->
      <Card class="col-span-full lg:col-span-4">
        <CardHeader>
          <CardTitle>Value by Location</CardTitle>
          <CardDescription>Total asset value stored in each location</CardDescription>
        </CardHeader>
        <CardContent class="h-[350px]">
          <div
            v-if="dashboard.valueByLocation.length === 0"
            class="text-muted-foreground flex h-full items-center justify-center"
          >
            No data available
          </div>
          <VisXYContainer v-else :data="dashboard.valueByLocation" class="h-full w-full">
            <VisTooltip />
            <VisCrosshair
              :template="(d: any) => `<b>${d.name}</b>: ${formatCurrency(d.totalValue)}`"
            />
            <VisStackedBar
              :x="(d: any, i: number) => i"
              :y="(d: any) => d.totalValue"
              color="#f15844"
            />
            <VisAxis type="x" :tickFormat="(i: number) => dashboard!.valueByLocation[i]?.name" />
            <VisAxis type="y" :tickFormat="formatCurrencyShort" />
          </VisXYContainer>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Items Table -->
    <Card v-if="dashboard">
      <CardHeader>
        <CardTitle>Recent Items</CardTitle>
        <CardDescription>The most recent assets added to your inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          v-if="dashboard.recentItems.length === 0"
          class="text-muted-foreground py-6 text-center"
        >
          No items found. Add your first item!
        </div>
        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Added On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in dashboard.recentItems" :key="item.id">
              <TableCell class="font-medium">
                <NuxtLink to="/items" class="hover:underline text-primary">
                  {{ item.name }}
                </NuxtLink>
              </TableCell>
              <TableCell>{{ item.category?.name || 'Uncategorized' }}</TableCell>
              <TableCell>{{ item.location?.name || 'Unassigned' }}</TableCell>
              <TableCell>{{ formatDate(item.createdAt) }}</TableCell>
              <TableCell>
                <Badge :variant="getStatusBadgeVariant(item.status)">
                  {{ item.status || 'Active' }}
                </Badge>
              </TableCell>
              <TableCell class="text-right font-medium">
                {{ item.purchasePrice ? formatCurrency(Number(item.purchasePrice)) : '-' }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
