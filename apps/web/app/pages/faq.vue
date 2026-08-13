<script setup lang="ts">
import { ArrowRight, ChevronDown, MessageCircle } from 'lucide-vue-next'

useSiteSeoHead({
  title: 'Perguntas frequentes',
  description:
    'Tire suas dúvidas sobre os serviços contábeis, atendimento e área do cliente da Razcon.'
})

const questions = [
  {
    question: 'Quais empresas a Razcon atende?',
    answer:
      'Atendemos pequenas e médias empresas de diferentes segmentos, desde negócios em fase de abertura até operações que precisam de uma contabilidade mais estratégica.'
  },
  {
    question: 'Como funciona a troca de contador?',
    answer:
      'Cuidamos do processo de forma organizada: entendemos o histórico da empresa, solicitamos os documentos necessários e planejamos a transição para que a rotina não pare.'
  },
  {
    question: 'A Razcon atende empresas de outras cidades?',
    answer:
      'Sim. Nosso atendimento é digital e consultivo, com canais para envio de documentos, reuniões e acompanhamento das obrigações. Também avaliamos atendimentos presenciais conforme a localidade.'
  },
  {
    question: 'O que está incluído na mensalidade?',
    answer:
      'Depende do plano escolhido. Em geral, os serviços podem incluir contabilidade, apuração fiscal, obrigações acessórias, folha de pagamento e relatórios gerenciais. Montamos o escopo conforme a necessidade do seu negócio.'
  },
  {
    question: 'Posso contratar apenas um serviço?',
    answer:
      'Sim. Também oferecemos soluções pontuais, como abertura e regularização, consultoria tributária e apoio em processos específicos.'
  },
  {
    question: 'Como faço para acompanhar os documentos da empresa?',
    answer:
      'Clientes da Razcon contam com uma área exclusiva para consultar documentos, acompanhar obrigações e falar com o time responsável pela conta.'
  }
]
</script>

<template>
  <div class="bg-surface-muted">
    <section class="bg-brand-navy-950 py-12 text-white sm:py-16">
      <div class="container-page max-w-4xl text-center">
        <p class="eyebrow-on-dark">Tem alguma dúvida?</p>
        <h1 class="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Respostas simples para decisões importantes
        </h1>
        <p
          class="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg"
        >
          Reunimos as perguntas que mais aparecem nas conversas com empresas que estão
          buscando uma contabilidade próxima e confiável.
        </p>
      </div>
    </section>
    <section
      class="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[0.7fr_1.3fr] lg:items-start"
    >
      <div class="rounded-[var(--radius-lg)] bg-brand-navy-900 p-6 text-white sm:p-7">
        <MessageCircle class="size-7 text-white" aria-hidden="true" />
        <h2 class="mt-8 text-2xl font-semibold">Não encontrou o que procurava?</h2>
        <p class="mt-3 text-sm leading-relaxed text-white/65">
          Cada empresa tem uma realidade. Fale com a gente e vamos responder pensando no
          seu cenário.
        </p>
        <NuxtLink to="/#contato" class="btn-accent focus-ring mt-7"
          >Falar com um especialista <ArrowRight class="ml-2 size-4"
        /></NuxtLink>
      </div>
      <div class="space-y-3">
        <details
          v-for="(item, index) in questions"
          :key="item.question"
          class="group rounded-[var(--radius-lg)] border border-border bg-surface p-5"
          :open="index === 0"
        >
          <summary
            class="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-semibold text-brand-navy-900 [&::-webkit-details-marker]:hidden"
          >
            {{ item.question
            }}<ChevronDown
              class="size-5 shrink-0 text-brand-navy-700 transition group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p class="max-w-2xl pt-4 text-sm leading-relaxed text-text-muted">
            {{ item.answer }}
          </p>
        </details>
      </div>
    </section>
  </div>
</template>
