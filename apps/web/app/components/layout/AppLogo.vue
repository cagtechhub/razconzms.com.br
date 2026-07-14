<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'header' | 'footer'
    compact?: boolean
  }>(),
  { variant: 'header', compact: false }
)
</script>

<template>
  <NuxtLink
    to="/"
    class="focus-ring inline-flex items-center gap-2 rounded-[var(--radius-sm)]"
  >
    <img
      src="/img/logo.png"
      alt="Razcon Soluções Contábeis"
      class="w-auto object-contain"
      :class="[
        compact ? 'h-9' : 'h-16',
        variant === 'footer' ? 'invert grayscale' : ''
      ]"
    />
  </NuxtLink>
</template>
