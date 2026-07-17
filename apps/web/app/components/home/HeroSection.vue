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
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(171,151,84,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(77,101,178,0.25),transparent_50%)]"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -right-24 top-10 size-[28rem] rounded-full bg-brand-gold-500/10 blur-3xl animate-float"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -bottom-28 -left-20 size-80 rounded-full bg-brand-navy-500/30 blur-3xl animate-float-delayed"
      aria-hidden="true"
    />

    <div
      class="container-page relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-28"
    >
      <div data-reveal>
        <h1
          class="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]"
        >
          Você cuida da sua empresa. A gente cuida da sua contabilidade.
        </h1>
        <p class="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
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
          class="absolute -inset-3 rounded-[2rem] border border-brand-gold-400/20"
          aria-hidden="true"
        />
        <div class="relative overflow-hidden rounded-[1.75rem] bg-brand-navy-900/40">
          <img
            src="/img/empresa/local-diurno.jpeg"
            alt="Especialista Razcon"
            class="aspect-[4/5] w-full object-cover object-center sm:aspect-[5/6]"
            loading="eager"
            decoding="async"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-brand-navy-950/80 via-brand-navy-950/10 to-transparent"
            aria-hidden="true"
          />
        </div>

        <!-- <div
          class="absolute bottom-5 left-4 right-4 rounded-2xl border border-white/15 bg-white/95 p-4 text-brand-navy-950 shadow-2xl backdrop-blur sm:bottom-8 sm:left-8 sm:right-auto sm:max-w-[17rem] animate-float"
        >
          <p class="text-sm font-semibold text-brand-navy-900">Tiago</p>
          <p class="mt-0.5 text-xs text-text-muted">
            Especialista fiscal · Equipe Razcon
          </p>
          <p class="mt-3 text-xs leading-relaxed text-text-muted">
            “Acompanho sua rotina de perto para que nenhum prazo passe despercebido.”
          </p>
        </div> -->
      </div>
    </div>
  </section>
</template>
