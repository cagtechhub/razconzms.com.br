<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

const { whatsappHref } = useWhatsapp()

const stats = [
  { value: '15+', label: 'anos de experiência de mercado' },
  { value: '98%', label: 'de clientes que indicariam a Razcon' },
  { value: '100%', label: 'foco em conformidade e tranquilidade' }
]
</script>

<template>
  <section class="relative z-10 -mt-8 pb-4 sm:-mt-12">
    <div class="container-page" data-reveal>
      <div
        class="rounded-[var(--radius-xl)] border border-border bg-surface px-6 py-8 shadow-sm sm:px-10 sm:py-10"
      >
        <div class="grid gap-8 sm:grid-cols-3 sm:gap-6">
          <div v-for="stat in stats" :key="stat.label" class="text-center sm:text-left">
            <p class="stat-number">{{ stat.value }}</p>
            <p class="mt-2 text-sm leading-relaxed text-text-muted">{{ stat.label }}</p>
          </div>
        </div>
        <div class="mt-8 flex justify-center border-t border-border pt-8">
          <a
            :href="whatsappHref"
            class="btn-pill-accent focus-ring"
            :target="whatsappHref.startsWith('http') ? '_blank' : undefined"
            :rel="whatsappHref.startsWith('http') ? 'noopener noreferrer' : undefined"
          >
            Contratar a Razcon
            <ArrowRight class="ml-2 size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
