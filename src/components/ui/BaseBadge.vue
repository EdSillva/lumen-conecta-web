<template>
  <div
    :class="['badge', badgeTypeClass(item.type), item.color ? item.color : '']"
    class="flex-nowrap gap-1 rounded-xl px-3 py-2"
  >
    <span>
      <component v-if="item.type == 'custom'" :is="item.icon" :size="item.iconSize ?? 'sm'" />
      <component v-else :is="badgeIconType(item.type)" :size="item.iconSize ?? 'sm'" />
    </span>
    <span class="text-xs">{{ item.name }}</span>
  </div>
</template>

<script setup lang="ts">
import { type Component } from 'vue'
import {
  CheckCircleOutlineIcon,
  AlertCircleOutlineIcon,
  InformationOutlineIcon,
  ProcessIcon,
} from '@/services/iconsCatalog.service'

const item = defineProps<{
  name: string
  icon?: Component
  color?: string
  type: 'info' | 'success' | 'warning' | 'error' | 'custom'
  iconSize?: 'xs' | 'sm' | 'md' | 'lg'
}>()

function badgeTypeClass(type: string) {
  switch (type) {
    case 'success':
      return 'badge-success'
    case 'warning':
      return 'badge-warning'
    case 'error':
      return 'badge-error'
    case 'info':
      return 'badge-info'
    case 'custom':
      return item.type === 'custom' && item.color ? `badge-${item.color}` : 'badge-neutral'
    default:
      return 'badge-info'
  }
}

function badgeIconType(type: string) {
  switch (type) {
    case 'success':
      return CheckCircleOutlineIcon
    case 'warning':
      return ProcessIcon
    case 'error':
      return AlertCircleOutlineIcon
    case 'info':
      return InformationOutlineIcon
    default:
      return InformationOutlineIcon
  }
}
</script>
