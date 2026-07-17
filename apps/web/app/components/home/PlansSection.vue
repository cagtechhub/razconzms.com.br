<script setup lang="ts">
import { ArrowRight, Check } from 'lucide-vue-next'

const { whatsappHref } = useWhatsapp()

const plans = [
  {
    name: 'Essencial',
    description: 'Para empresas que estão começando e precisam de uma base segura.',
    price: 'A partir de R$ 399',
    featured: false,
    features: ['Contabilidade mensal', 'Obrigações fiscais', 'Atendimento por e-mail']
  },
  {
    name: 'Gestão',
    description: 'Mais acompanhamento para empresas em fase de crescimento.',
    price: 'A partir de R$ 799',
    featured: true,
    features: [
      'Tudo do Essencial',
      'Folha de pagamento',
      'Reunião de acompanhamento',
      'Relatórios gerenciais'
    ]
  },
  {
    name: 'Sob medida',
    description:
      'Uma estrutura desenhada para a complexidade e os objetivos do seu negócio.',
    price: 'Vamos conversar',
    featured: false,
    features: [
      'Escopo personalizado',
      'Consultoria estratégica',
      'Canal direto com especialistas'
    ]
  }
]
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

      <div class="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
        <article
          v-for="(plan, index) in plans"
          :key="plan.name"
          class="relative flex flex-col rounded-[1.5rem] border p-7 transition duration-300"
          :class="
            plan.featured
              ? 'border-brand-navy-900 bg-brand-navy-900 text-white shadow-[0_28px_60px_-28px_rgba(15,20,36,0.55)] lg:-translate-y-4'
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
            :class="plan.featured ? 'text-brand-gold-300' : 'text-brand-gold-700'"
          >
            {{ plan.name }}
          </p>
          <p
            class="mt-4 min-h-12 text-sm leading-relaxed"
            :class="plan.featured ? 'text-white/65' : 'text-text-muted'"
          >
            {{ plan.description }}
          </p>
          <p
            class="mt-7 text-2xl font-semibold"
            :class="plan.featured ? 'text-white' : 'text-brand-navy-900'"
          >
            {{ plan.price }}
          </p>
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
                :class="plan.featured ? 'text-brand-gold-300' : 'text-brand-navy-600'"
                aria-hidden="true"
              />
              {{ feature }}
            </li>
          </ul>
          <a
            :href="whatsappHref"
            class="focus-ring mt-8 w-full"
            :class="plan.featured ? 'btn-pill-accent' : 'btn-primary'"
            :target="whatsappHref.startsWith('http') ? '_blank' : undefined"
            :rel="whatsappHref.startsWith('http') ? 'noopener noreferrer' : undefined"
          >
            Conversar sobre este plano
            <ArrowRight class="ml-2 size-4" aria-hidden="true" />
          </a>
        </article>
      </div>
    </div>
  </section>
</template>
