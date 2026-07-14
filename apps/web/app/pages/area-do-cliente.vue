<script setup lang="ts">
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  LockKeyhole,
  ShieldCheck
} from 'lucide-vue-next'

const mode = ref<'login' | 'signup'>('login')
const submitted = ref(false)

useSiteSeoHead({
  title: 'Área do cliente',
  description:
    'Acesse o portal da Razcon para acompanhar documentos, obrigações e informações da sua empresa.'
})

function submitForm() {
  submitted.value = true
}

function setMode(nextMode: 'login' | 'signup') {
  mode.value = nextMode
  submitted.value = false
}
</script>

<template>
  <div class="bg-surface-muted">
    <section class="bg-brand-navy-950 py-14 text-white sm:py-20">
      <div class="container-page grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
        <div>
          <p class="eyebrow text-brand-gold-300">Portal Razcon</p>
          <h1 class="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Sua empresa em ordem, na palma da mão.
          </h1>
          <p class="mt-5 max-w-xl text-base leading-relaxed text-white/70">
            Acesse documentos, acompanhe obrigações e mantenha uma conversa simples com o
            nosso time.
          </p>
        </div>
        <div class="flex gap-5 text-sm text-white/70 lg:justify-end">
          <span class="flex items-center gap-2"
            ><LockKeyhole class="size-4 text-brand-gold-400" /> Acesso seguro</span
          ><span class="flex items-center gap-2"
            ><ShieldCheck class="size-4 text-brand-gold-400" /> Dados protegidos</span
          >
        </div>
      </div>
    </section>

    <section
      class="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start"
    >
      <div class="max-w-md pt-2">
        <p class="eyebrow">Tudo centralizado</p>
        <h2 class="section-title">Mais autonomia para a sua rotina</h2>
        <p class="section-lead">
          O portal foi pensado para deixar as tarefas contábeis mais fáceis de acompanhar,
          sem perder o apoio humano quando você precisar.
        </p>
        <ul class="mt-8 space-y-5">
          <li class="flex gap-3">
            <span
              class="grid size-8 shrink-0 place-items-center rounded-full bg-brand-navy-50 text-brand-navy-900"
              ><CheckCircle2 class="size-4"
            /></span>
            <div>
              <p class="font-semibold text-brand-navy-900">Documentos organizados</p>
              <p class="mt-1 text-sm text-text-muted">
                Consulte arquivos e relatórios em um único lugar.
              </p>
            </div>
          </li>
          <li class="flex gap-3">
            <span
              class="grid size-8 shrink-0 place-items-center rounded-full bg-brand-navy-50 text-brand-navy-900"
              ><CheckCircle2 class="size-4"
            /></span>
            <div>
              <p class="font-semibold text-brand-navy-900">Calendário de obrigações</p>
              <p class="mt-1 text-sm text-text-muted">
                Veja o que já foi entregue e o que vem pela frente.
              </p>
            </div>
          </li>
          <li class="flex gap-3">
            <span
              class="grid size-8 shrink-0 place-items-center rounded-full bg-brand-navy-50 text-brand-navy-900"
              ><CheckCircle2 class="size-4"
            /></span>
            <div>
              <p class="font-semibold text-brand-navy-900">Canal com especialistas</p>
              <p class="mt-1 text-sm text-text-muted">
                Envie dúvidas e documentos para o nosso time.
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div
        class="rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-sm sm:p-8"
      >
        <div class="flex border-b border-border">
          <button
            class="focus-ring -mb-px border-b-2 px-1 pb-4 text-sm font-semibold"
            :class="
              mode === 'login'
                ? 'border-brand-gold-500 text-brand-navy-900'
                : 'border-transparent text-text-muted'
            "
            type="button"
            @click="setMode('login')"
          >
            Entrar
          </button>
          <button
            class="focus-ring -mb-px ml-6 border-b-2 px-1 pb-4 text-sm font-semibold"
            :class="
              mode === 'signup'
                ? 'border-brand-gold-500 text-brand-navy-900'
                : 'border-transparent text-text-muted'
            "
            type="button"
            @click="setMode('signup')"
          >
            Criar cadastro
          </button>
        </div>

        <div
          v-if="submitted"
          class="mt-6 rounded-[var(--radius-md)] bg-brand-navy-50 p-4 text-sm leading-relaxed text-brand-navy-900"
        >
          Recebemos sua solicitação. Esta demonstração está pronta para ser conectada ao
          sistema de autenticação da Razcon.
        </div>
        <form class="mt-7 grid gap-4" @submit.prevent="submitForm">
          <div v-if="mode === 'signup'" class="grid gap-4 sm:grid-cols-2">
            <label class="text-sm font-medium text-brand-navy-900"
              >Nome completo<input
                required
                class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
                type="text"
                placeholder="Seu nome"
            /></label>
            <label class="text-sm font-medium text-brand-navy-900"
              >Empresa<input
                required
                class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
                type="text"
                placeholder="Nome da empresa"
            /></label>
          </div>
          <label class="text-sm font-medium text-brand-navy-900"
            >E-mail corporativo<input
              required
              class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
              type="email"
              placeholder="voce@empresa.com"
          /></label>
          <label v-if="mode === 'signup'" class="text-sm font-medium text-brand-navy-900"
            >CNPJ<input
              required
              class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
              type="text"
              placeholder="00.000.000/0000-00"
          /></label>
          <label class="text-sm font-medium text-brand-navy-900"
            >Senha<input
              required
              class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
              type="password"
              placeholder="••••••••"
          /></label>
          <button class="btn-primary focus-ring mt-2 w-full" type="submit">
            {{ mode === 'login' ? 'Acessar portal' : 'Solicitar cadastro'
            }}<ArrowRight class="ml-2 size-4" />
          </button>
          <p class="text-center text-xs text-text-muted">
            Ao continuar, você concorda com os termos de uso e a política de privacidade.
          </p>
        </form>
      </div>
    </section>

    <section class="border-t border-border bg-surface py-12">
      <div
        class="container-page flex flex-col gap-4 rounded-[var(--radius-lg)] border border-brand-navy-100 bg-brand-navy-50 p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex gap-4">
          <span
            class="grid size-10 shrink-0 place-items-center rounded-[var(--radius-md)] bg-brand-navy-900 text-white"
            ><Building2 class="size-5"
          /></span>
          <div>
            <p class="font-semibold text-brand-navy-900">Ainda não é cliente?</p>
            <p class="mt-1 text-sm text-text-muted">
              Conheça nossas soluções e descubra como podemos ajudar sua empresa.
            </p>
          </div>
        </div>
        <NuxtLink to="/#contato" class="btn-primary focus-ring w-fit"
          >Falar com a Razcon</NuxtLink
        >
      </div>
    </section>
  </div>
</template>
