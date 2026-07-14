<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'header' | 'footer'
  }>(),
  { variant: 'header' }
)
</script>

<template>
  <NuxtLink
    to="/"
    class="focus-ring inline-flex items-center gap-2 rounded-[var(--radius-sm)]"
  >
    <!-- <span
      class="grid size-9 place-items-center rounded-[var(--radius-sm)] bg-brand-navy-900 text-sm font-bold tracking-tight text-brand-gold-500"
      aria-hidden="true"
    >
      R
    </span>
    <span class="leading-tight">
      <span
        class="block text-sm font-semibold tracking-wide"
        :class="variant === 'footer' ? 'text-white' : 'text-brand-navy-900'"
      >
        Razcon
      </span>
      <span
        class="block text-[10px] font-medium uppercase tracking-[0.16em]"
        :class="variant === 'footer' ? 'text-brand-gold-400' : 'text-brand-gold-600'"
      >
        Contábeis
      </span>
    </span> -->
    <img
      src="/img/logo.png"
      alt="Razcon Soluções Contábeis"
      class="h-16"
      :class="variant === 'footer' ? 'invert grayscale' : ''"
    />
  </NuxtLink>
</template>
