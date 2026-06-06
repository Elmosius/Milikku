import type { Component } from 'vue'
import {
  Book,
  Briefcase,
  Camera,
  Car,
  Coffee,
  Folder,
  Gamepad2,
  Gift,
  Heart,
  Home,
  Laptop,
  MapPin,
  Music,
  Plane,
  Shirt,
  ShoppingBag,
  Smartphone,
  Star,
  Video,
} from 'lucide-vue-next'

export const availableIcons: { name: string; component: Component }[] = [
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

export const iconMap: Record<string, Component> = Object.fromEntries(
  availableIcons.map((icon) => [icon.name, icon.component]),
)
