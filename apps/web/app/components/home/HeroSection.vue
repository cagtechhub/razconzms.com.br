<script setup lang="ts">
import { ArrowRight, CheckCircle2 } from 'lucide-vue-next'

const { whatsappHref } = useWhatsapp()

const benefits = [
  { before: 'Sua empresa regularizada e ', highlight: 'sem multas indesejadas' },
  { before: 'Orientação para ', highlight: 'economia no pagamento de impostos' },
  { before: 'Suporte com ', highlight: 'contadores especialistas' },
  { before: 'Atendimento ', highlight: 'próximo e humanizado' }
]
</script>

<template>
  <section class="relative overflow-hidden bg-brand-navy-950 text-white">
    <div
      class="container-page relative grid gap-12 py-14 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:py-20"
    >
      <div data-reveal>
        <h1
          class="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-[2.75rem] lg:leading-[1.15]"
        >
          Você cuida da sua empresa. A gente cuida da sua contabilidade.
        </h1>
        <p class="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
          Deixe a burocracia com a Razcon. Cuidamos da rotina fiscal, trabalhista e
          contábil para você empreender com tranquilidade.
        </p>

        <ul class="mt-8 space-y-3.5">
          <li
            v-for="benefit in benefits"
            :key="benefit.highlight"
            class="flex items-start gap-3 text-sm leading-relaxed text-white/80 sm:text-base"
          >
            <span
              class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white text-brand-navy-900"
            >
              <CheckCircle2 class="size-3.5" aria-hidden="true" />
            </span>
            <span>
              {{ benefit.before
              }}<strong class="font-semibold text-white">{{ benefit.highlight }}</strong>
            </span>
          </li>
        </ul>

        <div class="mt-10 flex flex-wrap gap-3">
          <a
            :href="whatsappHref"
            class="btn-pill-accent focus-ring"
            :target="whatsappHref.startsWith('http') ? '_blank' : undefined"
            :rel="whatsappHref.startsWith('http') ? 'noopener noreferrer' : undefined"
          >
            Falar com especialista
            <ArrowRight class="ml-2 size-4" aria-hidden="true" />
          </a>
          <NuxtLink to="/#servicos" class="btn-pill-outline focus-ring">
            Conhecer soluções
          </NuxtLink>
        </div>
      </div>

      <div class="relative mx-auto w-full max-w-lg" data-reveal data-reveal-delay="120">
        <div
          class="relative overflow-hidden rounded-[var(--radius-xl)] border border-white/10"
        >
          <img
            src="/img/empresa/escritorio-1.jpeg"
            alt="Escritório da Razcon Soluções Contábeis"
            class="aspect-[4/5] w-full object-cover object-center sm:aspect-[5/6]"
            loading="eager"
            decoding="async"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-brand-navy-950/70 via-transparent to-transparent"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  </section>
</template>
