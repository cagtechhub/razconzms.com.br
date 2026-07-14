<script setup lang="ts">
import { Quote } from 'lucide-vue-next'

const testimonials = [
  {
    quote:
      'A Razcon trouxe clareza para a nossa rotina. Hoje sabemos o que precisa ser feito e conseguimos focar no crescimento.',
    name: 'Juliana Martins',
    company: 'Sabor & Origem Gastronomia'
  },
  {
    quote:
      'O atendimento é próximo e as respostas são objetivas. Sentimos que temos um time ao nosso lado, não apenas um fornecedor.',
    name: 'Eduardo Lima',
    company: 'Lima Tecnologia'
  },
  {
    quote:
      'Desde a abertura da empresa, fomos orientados em cada etapa. A segurança para tomar decisões mudou completamente.',
    name: 'Ana Beatriz Souza',
    company: 'Studio Bia Arquitetura'
  }
]
</script>

<template>
  <section id="depoimentos" class="border-b border-border bg-surface py-20 sm:py-24">
    <div class="container-page">
      <div class="max-w-xl">
        <p class="eyebrow">Quem confia</p>
        <h2 class="section-title">Parcerias que vão além dos números</h2>
      </div>
      <div class="mt-12 grid gap-5 lg:grid-cols-3">
        <figure
          v-for="testimonial in testimonials"
          :key="testimonial.name"
          class="flex flex-col rounded-[var(--radius-lg)] border border-border p-6"
        >
          <Quote class="size-7 text-brand-gold-500" aria-hidden="true" />
          <blockquote class="mt-5 flex-1 text-base leading-relaxed text-brand-navy-900">
            “{{ testimonial.quote }}”
          </blockquote>
          <figcaption class="mt-7 border-t border-border pt-4">
            <p class="text-sm font-semibold text-brand-navy-900">
              {{ testimonial.name }}
            </p>
            <p class="mt-1 text-xs text-text-muted">{{ testimonial.company }}</p>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>
