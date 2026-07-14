<script setup lang="ts">
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Calculator,
  Landmark,
  ReceiptText,
  Users
} from 'lucide-vue-next'

const services = [
  {
    icon: Calculator,
    number: '01',
    title: 'Contabilidade completa',
    description:
      'Escrituração, balancetes e demonstrações que transformam números em decisões melhores.'
  },
  {
    icon: ReceiptText,
    number: '02',
    title: 'Fiscal e tributário',
    description:
      'Apuração de impostos, obrigações acessórias e planejamento para evitar surpresas.'
  },
  {
    icon: Users,
    number: '03',
    title: 'Folha e departamento pessoal',
    description:
      'Admissões, folha, encargos e rotinas trabalhistas conduzidos com atenção aos detalhes.'
  },
  {
    icon: BriefcaseBusiness,
    number: '04',
    title: 'Abertura e regularização',
    description:
      'Do planejamento societário à regularização, sua empresa começa pelo caminho certo.'
  },
  {
    icon: BarChart3,
    number: '05',
    title: 'Relatórios para gestão',
    description:
      'Indicadores e análises para você entender o presente e planejar os próximos passos.'
  },
  {
    icon: Landmark,
    number: '06',
    title: 'Consultoria próxima',
    description:
      'Orientação acessível para dúvidas do dia a dia e decisões importantes do negócio.'
  }
]
</script>

<template>
  <section id="servicos" class="border-b border-border bg-surface py-20 sm:py-24">
    <div class="container-page">
      <div class="max-w-2xl">
        <p class="eyebrow">Nossas soluções</p>
        <h2 class="section-title">Uma contabilidade que entende o seu negócio</h2>
        <p class="section-lead">
          Da rotina obrigatória à visão estratégica, reunimos o que sua empresa precisa
          para operar bem e crescer com consistência.
        </p>
      </div>
      <ul class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="service in services"
          :key="service.number"
          class="group rounded-[var(--radius-lg)] border border-border bg-surface p-6 transition hover:-translate-y-1 hover:border-brand-navy-200 hover:shadow-lg"
        >
          <div class="flex items-start justify-between">
            <span
              class="grid size-11 place-items-center rounded-[var(--radius-md)] bg-brand-navy-50 text-brand-navy-900 transition group-hover:bg-brand-navy-900 group-hover:text-white"
              ><component :is="service.icon" class="size-5" aria-hidden="true"
            /></span>
            <span class="text-xs font-semibold tabular-nums text-brand-gold-600">{{
              service.number
            }}</span>
          </div>
          <h3 class="mt-6 text-lg font-semibold text-brand-navy-900">
            {{ service.title }}
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-text-muted">
            {{ service.description }}
          </p>
          <NuxtLink
            to="/#contato"
            class="focus-ring mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-navy-900 hover:text-brand-gold-700"
            >Saiba mais <ArrowRight class="size-3.5" aria-hidden="true"
          /></NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>
