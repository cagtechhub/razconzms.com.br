<script setup lang="ts">
import { Quote, Star } from 'lucide-vue-next'

const testimonials = [
  {
    quote:
      'A Razcon trouxe clareza para a nossa rotina. Hoje sabemos o que precisa ser feito e conseguimos focar no crescimento.',
    name: 'Juliana Martins',
    company: 'Sabor & Origem Gastronomia',
    initials: 'JM'
  },
  {
    quote:
      'O atendimento é próximo e as respostas são objetivas. Sentimos que temos um time ao nosso lado, não apenas um fornecedor.',
    name: 'Eduardo Lima',
    company: 'Lima Tecnologia',
    initials: 'EL'
  },
  {
    quote:
      'Desde a abertura da empresa, fomos orientados em cada etapa. A segurança para tomar decisões mudou completamente.',
    name: 'Ana Beatriz Souza',
    company: 'Studio Bia Arquitetura',
    initials: 'AB'
  }
]
</script>

<template>
  <section id="depoimentos" class="bg-brand-navy-50 py-20 sm:py-24">
    <div class="container-page">
      <div class="mx-auto max-w-2xl text-center" data-reveal>
        <p class="eyebrow">Quem confia</p>
        <h2 class="section-title">Depoimentos que reforçam o nosso compromisso</h2>
        <p class="section-lead mx-auto">
          Parcerias que vão além dos números — com proximidade, clareza e um jeito
          moderno de cuidar da contabilidade.
        </p>
      </div>

      <div class="mt-14 grid gap-6 lg:grid-cols-3">
        <figure
          v-for="(testimonial, index) in testimonials"
          :key="testimonial.name"
          class="marketing-card flex flex-col p-7"
          data-reveal
          :data-reveal-delay="String(index * 80)"
        >
          <div class="flex items-center justify-between gap-3">
            <Quote class="size-8 text-brand-gold-500" aria-hidden="true" />
            <div class="flex gap-0.5 text-brand-gold-500" aria-label="5 estrelas">
              <Star
                v-for="n in 5"
                :key="n"
                class="size-3.5 fill-current"
                aria-hidden="true"
              />
            </div>
          </div>
          <blockquote class="mt-5 flex-1 text-base leading-relaxed text-brand-navy-900">
            “{{ testimonial.quote }}”
          </blockquote>
          <figcaption class="mt-7 flex items-center gap-3 border-t border-border pt-5">
            <span
              class="grid size-11 place-items-center rounded-full bg-brand-navy-900 text-xs font-bold text-white"
            >
              {{ testimonial.initials }}
            </span>
            <div>
              <p class="text-sm font-semibold text-brand-navy-900">
                {{ testimonial.name }}
              </p>
              <p class="mt-0.5 text-xs text-text-muted">{{ testimonial.company }}</p>
            </div>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>
