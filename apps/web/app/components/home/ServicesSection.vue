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
  <section id="servicos" class="bg-surface-muted py-20 sm:py-24">
    <div class="container-page">
      <div class="mx-auto max-w-2xl text-center" data-reveal>
        <p class="eyebrow">Nossas soluções</p>
        <h2 class="section-title">Tudo o que sua empresa precisa para crescer</h2>
        <p class="section-lead mx-auto">
          Tenha especialistas dedicados ao seu negócio, cuidando diariamente da
          contabilidade com clareza e proximidade.
        </p>
      </div>

      <ul class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="(service, index) in services"
          :key="service.number"
          class="marketing-card group p-7"
          data-reveal
          :data-reveal-delay="String(index * 60)"
        >
          <div class="flex items-start justify-between gap-3">
            <span
              class="marketing-icon transition duration-300 group-hover:bg-brand-navy-900 group-hover:text-white"
            >
              <component :is="service.icon" class="size-5" aria-hidden="true" />
            </span>
            <span class="text-xs font-semibold tabular-nums text-text-muted">{{
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
            class="focus-ring mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy-900 transition hover:text-brand-navy-700"
          >
            Saiba mais
            <ArrowRight class="size-3.5" aria-hidden="true" />
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>
