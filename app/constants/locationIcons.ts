import type { Component } from 'vue';
import {
  Archive,
  Armchair,
  Bath,
  Bed,
  BedDouble,
  Box,
  Briefcase,
  Building,
  Car,
  Coffee,
  DoorClosed,
  Folder,
  Home,
  Lamp,
  MapPin,
  Monitor,
  Package,
  Refrigerator,
  Sofa,
  Store,
  Tv,
  Warehouse,
} from 'lucide-vue-next';

export const locationIcons: { name: string; component: Component }[] = [
  { name: 'MapPin', component: MapPin },
  { name: 'Home', component: Home },
  { name: 'Building', component: Building },
  { name: 'Warehouse', component: Warehouse },
  { name: 'Store', component: Store },
  { name: 'Bed', component: Bed },
  { name: 'BedDouble', component: BedDouble },
  { name: 'Sofa', component: Sofa },
  { name: 'Armchair', component: Armchair },
  { name: 'DoorClosed', component: DoorClosed }, // Bisa untuk lemari
  { name: 'Box', component: Box },
  { name: 'Package', component: Package },
  { name: 'Archive', component: Archive },
  { name: 'Folder', component: Folder },
  { name: 'Bath', component: Bath },
  { name: 'Refrigerator', component: Refrigerator },
  { name: 'Tv', component: Tv },
  { name: 'Monitor', component: Monitor },
  { name: 'Lamp', component: Lamp },
  { name: 'Coffee', component: Coffee },
  { name: 'Briefcase', component: Briefcase },
  { name: 'Car', component: Car },
];

export const locationIconMap: Record<string, Component> = Object.fromEntries(
  locationIcons.map((icon) => [icon.name, icon.component]),
);
