<script setup lang="ts">
const props = defineProps<{
  open: boolean
  title: string
  description?: string
  wide?: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') emit('close')
}

watch(
  () => props.open,
  (open) => {
    if (!import.meta.client) return
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) window.addEventListener('keydown', onKeydown)
    else window.removeEventListener('keydown', onKeydown)
  },
  { immediate: true }
)

onUnmounted(() => {
  if (!import.meta.client) return
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
    >
      <button
        type="button"
        class="absolute inset-0 bg-brand-navy-950/50"
        aria-label="Fechar"
        @click="emit('close')"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        class="relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-t-[var(--radius-xl)] border border-border bg-surface p-6 shadow-lg sm:rounded-[var(--radius-xl)]"
        :class="wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 id="admin-modal-title" class="text-lg font-semibold text-brand-navy-900">
              {{ title }}
            </h2>
            <p v-if="description" class="mt-1 text-sm text-text-muted">
              {{ description }}
            </p>
          </div>
          <button
            type="button"
            class="btn-secondary focus-ring px-3 py-2"
            @click="emit('close')"
          >
            Fechar
          </button>
        </div>
        <div class="mt-5">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
