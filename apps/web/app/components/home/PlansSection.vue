<script setup lang="ts">
import { ArrowRight, Check } from 'lucide-vue-next'
import type { Plan } from '@razconms/shared'

const { buildHref } = useWhatsapp()

const { data: plans, status } = await useAsyncData('public-plans', async () => {
  const base = resolveApiBase()
  if (!base) return [] as Plan[]
  try {
    return await $fetch<Plan[]>(`${base}/plans`)
  } catch {
    return [] as Plan[]
  }
})

const ctaLabel = (plan: Plan) => plan.ctaLabel?.trim() || 'Conversar sobre este plano'
const planHref = (name: string) => buildHref(`Olá! Tenho interesse no plano ${name}.`)
</script>

<template>
  <section id="planos" class="bg-surface py-20 sm:py-24">
    <div class="container-page">
      <div class="mx-auto max-w-2xl text-center" data-reveal>
        <p class="eyebrow">Planos para cada fase</p>
        <h2 class="section-title">Escolha o nível de apoio que faz sentido hoje</h2>
        <p class="section-lead mx-auto">
          Comece com o essencial e evolua quando sua empresa estiver pronta. Todos os
          planos têm atendimento humano e transparente.
        </p>
      </div>

      <p v-if="status === 'pending'" class="mt-14 text-center text-sm text-text-muted">
        Carregando planos…
      </p>
      <p
        v-else-if="!plans?.length"
        class="mt-14 rounded-[var(--radius-lg)] border border-border bg-surface-muted px-5 py-10 text-center text-sm text-text-muted"
      >
        Os planos serão publicados em breve.
      </p>

      <div v-else class="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
        <article
          v-for="(plan, index) in plans"
          :key="plan.id"
          class="relative flex flex-col rounded-[var(--radius-lg)] border p-7"
          :class="
            plan.featured
              ? 'border-brand-navy-900 bg-brand-navy-900 text-white'
              : 'marketing-card border-border'
          "
          data-reveal
          :data-reveal-delay="String(index * 80)"
        >
          <span
            v-if="plan.featured"
            class="absolute -top-3 left-7 rounded-full bg-brand-gold-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-brand-navy-950"
          >
            Mais escolhido
          </span>
          <p
            class="text-sm font-semibold"
            :class="plan.featured ? 'text-white/80' : 'text-brand-navy-900'"
          >
            {{ plan.name }}
          </p>
          <p
            class="mt-4 min-h-12 text-sm leading-relaxed"
            :class="plan.featured ? 'text-white/65' : 'text-text-muted'"
          >
            {{ plan.description }}
          </p>
          <div class="mt-7">
            <template v-if="!plan.showPrice">
              <p
                class="text-2xl font-semibold"
                :class="plan.featured ? 'text-white' : 'text-brand-navy-900'"
              >
                Vamos conversar
              </p>
            </template>
            <template v-else>
              <p
                v-if="plan.priceOriginalCents != null && plan.pricePromoCents != null"
                class="text-sm tabular-nums line-through"
                :class="plan.featured ? 'text-white/50' : 'text-text-muted'"
              >
                {{ centsToBrl(plan.priceOriginalCents) }}
              </p>
              <p
                class="text-2xl font-semibold tabular-nums"
                :class="plan.featured ? 'text-white' : 'text-brand-navy-900'"
              >
                {{
                  plan.pricePromoCents != null
                    ? centsToBrl(plan.pricePromoCents)
                    : plan.priceOriginalCents != null
                      ? centsToBrl(plan.priceOriginalCents)
                      : 'Vamos conversar'
                }}
              </p>
            </template>
          </div>
          <ul
            class="mt-7 flex-1 space-y-3 border-t pt-6"
            :class="plan.featured ? 'border-white/10' : 'border-border'"
          >
            <li
              v-for="feature in plan.features"
              :key="feature"
              class="flex items-center gap-2 text-sm"
              :class="plan.featured ? 'text-white/80' : 'text-text-muted'"
            >
              <Check
                class="size-4 shrink-0"
                :class="plan.featured ? 'text-white' : 'text-brand-navy-700'"
                aria-hidden="true"
              />
              {{ feature }}
            </li>
          </ul>
          <a
            :href="planHref(plan.name)"
            class="focus-ring mt-8 w-full"
            :class="plan.featured ? 'btn-pill-accent' : 'btn-primary'"
            :target="planHref(plan.name).startsWith('http') ? '_blank' : undefined"
            :rel="
              planHref(plan.name).startsWith('http') ? 'noopener noreferrer' : undefined
            "
          >
            {{ ctaLabel(plan) }}
            <ArrowRight class="ml-2 size-4" aria-hidden="true" />
          </a>
        </article>
      </div>
    </div>
  </section>
</template>
