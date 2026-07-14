<script setup lang="ts">
import { ArrowRight, Calculator, FileText, Users } from 'lucide-vue-next'

const { whatsappHref } = useWhatsapp()

useSiteSeoHead({
  title: 'Contabilidade com clareza e confiança',
  description:
    'Razcon Soluções Contábeis — obrigações fiscais, folha de pagamento, lançamentos e orientação para o crescimento da sua empresa.'
})

const services = [
  {
    icon: Calculator,
    title: 'Contabilidade societária',
    description:
      'Lançamentos, balancetes e relatórios com precisão para decisão e compliance.'
  },
  {
    icon: FileText,
    title: 'Obrigações fiscais',
    description: 'Apuração, entrega e acompanhamento das obrigações acessórias no prazo.'
  },
  {
    icon: Users,
    title: 'Folha e departamento pessoal',
    description: 'Folha, encargos e rotinas trabalhistas com organização e transparência.'
  }
]
</script>

<template>
  <div>
    <section class="relative overflow-hidden bg-brand-navy-950 text-white">
      <div
        class="pointer-events-none absolute inset-0 opacity-40"
        style="
          background:
            radial-gradient(
              ellipse 80% 60% at 80% 20%,
              rgba(171, 151, 84, 0.18),
              transparent 55%
            ),
            radial-gradient(
              ellipse 60% 50% at 10% 80%,
              rgba(77, 101, 178, 0.25),
              transparent 50%
            );
        "
      />
      <div class="container-page relative py-20 sm:py-28 lg:py-32">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold-400">
          Razcon Soluções Contábeis
        </p>
        <h1
          class="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
        >
          Contabilidade sóbria, clara e no prazo.
        </h1>
        <p class="mt-6 max-w-2xl text-base text-white/75 sm:text-lg">
          Apoio contábil e fiscal para empresas que precisam de rotina organizada, números
          confiáveis e orientação objetiva.
        </p>
        <div class="mt-10 flex flex-wrap gap-3">
          <a
            :href="whatsappHref"
            class="btn-accent focus-ring"
            :target="whatsappHref.startsWith('http') ? '_blank' : undefined"
            :rel="whatsappHref.startsWith('http') ? 'noopener noreferrer' : undefined"
          >
            Solicitar atendimento
            <ArrowRight class="ml-2 size-4" aria-hidden="true" />
          </a>
          <NuxtLink
            to="/#servicos"
            class="btn-primary focus-ring border border-white/15 bg-white/5 hover:bg-white/10"
          >
            Ver serviços
          </NuxtLink>
        </div>
      </div>
    </section>

    <section id="servicos" class="border-b border-border bg-surface py-16 sm:py-20">
      <div class="container-page">
        <h2 class="text-2xl font-semibold tracking-tight text-brand-navy-900 sm:text-3xl">
          Serviços
        </h2>
        <p class="mt-3 max-w-2xl text-text-muted">
          Escopo inicial do portal institucional. O produto completo (lançamentos, NF, DRE
          e portal do cliente) evolui a partir desta base.
        </p>

        <ul class="mt-10 grid gap-6 md:grid-cols-3">
          <li
            v-for="service in services"
            :key="service.title"
            class="rounded-[var(--radius-lg)] border border-border bg-surface p-6"
          >
            <span
              class="grid size-10 place-items-center rounded-[var(--radius-md)] bg-brand-navy-50 text-brand-navy-900"
            >
              <component :is="service.icon" class="size-5" aria-hidden="true" />
            </span>
            <h3 class="mt-4 text-lg font-semibold text-brand-navy-900">
              {{ service.title }}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-text-muted">
              {{ service.description }}
            </p>
          </li>
        </ul>
      </div>
    </section>

    <section id="sobre" class="border-b border-border bg-surface-muted py-16 sm:py-20">
      <div class="container-page max-w-3xl">
        <h2 class="text-2xl font-semibold tracking-tight text-brand-navy-900 sm:text-3xl">
          Sobre
        </h2>
        <p class="mt-4 text-base leading-relaxed text-text-muted">
          A Razcon une disciplina técnica e comunicação clara. Nosso objetivo é manter a
          empresa em dia com as obrigações e entregar informação contábil útil para
          gestão.
        </p>
      </div>
    </section>

    <section id="contato" class="bg-surface py-16 sm:py-20">
      <div class="container-page">
        <div
          class="rounded-[var(--radius-xl)] bg-brand-navy-900 px-6 py-10 text-white sm:px-10"
        >
          <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">
            Vamos conversar
          </h2>
          <p class="mt-3 max-w-xl text-white/75">
            Conte um pouco sobre a sua empresa e o que precisa resolver. Retornamos com o
            melhor caminho de atendimento.
          </p>
          <a
            :href="whatsappHref"
            class="btn-accent focus-ring mt-8"
            :target="whatsappHref.startsWith('http') ? '_blank' : undefined"
            :rel="whatsappHref.startsWith('http') ? 'noopener noreferrer' : undefined"
          >
            Abrir conversa
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
