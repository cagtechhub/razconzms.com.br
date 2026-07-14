<script setup lang="ts">
import {
  ArrowRight,
  BarChart3,
  Check,
  Clock3,
  ShieldCheck,
  Sparkles
} from 'lucide-vue-next'

const { whatsappHref } = useWhatsapp()
</script>

<template>
  <section class="relative overflow-hidden bg-brand-navy-950 text-white">
    <div
      class="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-brand-gold-500/10 blur-3xl"
    />
    <div
      class="pointer-events-none absolute -bottom-32 -left-16 size-80 rounded-full bg-brand-navy-500/20 blur-3xl"
    />
    <div
      class="container-page relative grid gap-14 py-20 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-32"
    >
      <div>
        <p
          class="inline-flex items-center gap-2 rounded-full border border-brand-gold-400/30 bg-brand-gold-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold-300"
        >
          <Sparkles class="size-3.5" aria-hidden="true" />
          Contabilidade que acompanha
        </p>
        <h1
          class="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
        >
          O seu negócio cresce. A gente cuida do resto.
        </h1>
        <p class="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
          Soluções contábeis para empresas que valorizam tranquilidade, organização e
          decisões baseadas em informação confiável.
        </p>
        <div class="mt-10 flex flex-wrap gap-3">
          <a
            :href="whatsappHref"
            class="btn-accent focus-ring"
            :target="whatsappHref.startsWith('http') ? '_blank' : undefined"
            :rel="whatsappHref.startsWith('http') ? 'noopener noreferrer' : undefined"
          >
            Falar com um especialista
            <ArrowRight class="ml-2 size-4" aria-hidden="true" />
          </a>
          <NuxtLink
            to="/#servicos"
            class="btn-primary focus-ring border border-white/15 bg-white/5 hover:bg-white/10"
          >
            Conhecer soluções
          </NuxtLink>
        </div>
        <div class="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm text-white/60">
          <span class="inline-flex items-center gap-2"
            ><ShieldCheck class="size-4 text-brand-gold-400" /> Segurança e
            conformidade</span
          >
          <span class="inline-flex items-center gap-2"
            ><Clock3 class="size-4 text-brand-gold-400" /> Respostas no seu tempo</span
          >
        </div>
      </div>

      <div class="relative mx-auto w-full max-w-md">
        <div
          class="absolute -inset-4 rounded-[var(--radius-xl)] border border-brand-gold-400/20"
        />
        <div
          class="relative overflow-hidden rounded-[var(--radius-xl)] border border-white/10 bg-white p-5 text-brand-navy-950 shadow-2xl sm:p-6"
        >
          <div class="flex items-start justify-between border-b border-neutral-100 pb-5">
            <div>
              <p
                class="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted"
              >
                Visão da empresa
              </p>
              <p class="mt-1 text-lg font-semibold">Tudo em ordem</p>
            </div>
            <span
              class="grid size-9 place-items-center rounded-full bg-brand-navy-50 text-brand-navy-900"
              ><BarChart3 class="size-4"
            /></span>
          </div>
          <div class="grid grid-cols-2 gap-3 py-5">
            <div class="rounded-[var(--radius-md)] bg-brand-navy-50 p-4">
              <p class="text-xs text-text-muted">Obrigações</p>
              <p class="mt-2 text-2xl font-semibold tabular-nums">100%</p>
              <p class="mt-1 text-xs font-medium text-success">Em dia</p>
            </div>
            <div class="rounded-[var(--radius-md)] bg-brand-gold-50 p-4">
              <p class="text-xs text-text-muted">Economia</p>
              <p class="mt-2 text-2xl font-semibold tabular-nums">+18%</p>
              <p class="mt-1 text-xs font-medium text-brand-gold-700">Otimizada</p>
            </div>
          </div>
          <div class="rounded-[var(--radius-md)] border border-neutral-100 p-4">
            <div class="flex items-center justify-between text-xs text-text-muted">
              <span>Saúde financeira</span><span>2024 — 2025</span>
            </div>
            <div class="mt-5 flex h-20 items-end gap-2">
              <span class="h-8 flex-1 rounded-t bg-brand-navy-100" /><span
                class="h-11 flex-1 rounded-t bg-brand-navy-200"
              /><span class="h-10 flex-1 rounded-t bg-brand-navy-300" /><span
                class="h-14 flex-1 rounded-t bg-brand-navy-400"
              /><span class="h-16 flex-1 rounded-t bg-brand-navy-600" /><span
                class="h-20 flex-1 rounded-t bg-brand-navy-900"
              />
            </div>
          </div>
          <div class="mt-4 flex items-center gap-3 text-xs text-text-muted">
            <span
              class="grid size-7 place-items-center rounded-full bg-brand-gold-100 text-brand-gold-700"
              ><Check class="size-3.5"
            /></span>
            Acompanhamento feito por especialistas
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
