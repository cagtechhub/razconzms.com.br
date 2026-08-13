<script setup lang="ts">
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  LockKeyhole,
  MessageCircle,
  ShieldCheck
} from 'lucide-vue-next'

type AccessMode = 'login' | 'signup' | 'recovery'

const mode = ref<AccessMode>('login')
const notice = ref('')
const passwordVisible = ref(false)

const formHeading = computed(() => {
  if (mode.value === 'signup') return 'Crie seu acesso ao portal'
  if (mode.value === 'recovery') return 'Recupere seu acesso'
  return 'Bem-vindo de volta'
})

const formDescription = computed(() => {
  if (mode.value === 'signup') {
    return 'Preencha os dados da empresa e nossa equipe confirma o cadastro.'
  }
  if (mode.value === 'recovery') {
    return 'Enviaremos as instruções para o e-mail cadastrado.'
  }
  return 'Acesse documentos, obrigações e converse com o nosso time.'
})

const submitLabel = computed(() => {
  if (mode.value === 'signup') return 'Solicitar cadastro'
  if (mode.value === 'recovery') return 'Enviar instruções'
  return 'Acessar portal'
})

useSiteSeoHead({
  title: 'Área do cliente',
  description:
    'Acesse o portal da Razcon para acompanhar documentos, obrigações e informações da sua empresa.'
})

function setMode(nextMode: AccessMode) {
  mode.value = nextMode
  notice.value = ''
  passwordVisible.value = false
}

function submitForm() {
  if (mode.value === 'signup') {
    notice.value =
      'Recebemos seus dados. Nossa equipe vai analisar a solicitação e retornar em breve.'
    return
  }

  if (mode.value === 'recovery') {
    notice.value =
      'Se o e-mail estiver cadastrado, você receberá as instruções em instantes.'
    return
  }

  notice.value =
    'Este ambiente de demonstração está pronto para ser conectado à autenticação.'
}

function togglePasswordVisibility() {
  passwordVisible.value = !passwordVisible.value
}
</script>

<template>
  <div class="min-h-[calc(100dvh-4.25rem)] bg-surface">
    <header class="border-b border-brand-navy-900 bg-brand-navy-900 text-white">
      <div class="container-page flex h-14 items-center justify-between sm:h-16">
        <NuxtLink
          to="/"
          class="focus-ring inline-flex items-center gap-2 rounded-[var(--radius-sm)] text-sm text-white/75 transition hover:text-white"
        >
          <ArrowLeft class="size-4" aria-hidden="true" />
          Voltar para o site
        </NuxtLink>
        <p class="text-sm font-medium text-white/80">Portal do cliente</p>
      </div>
    </header>

    <section
      class="container-page grid gap-8 py-10 md:grid-cols-2 md:items-start md:py-14"
    >
      <aside
        class="rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:p-8"
      >
        <div class="flex items-center gap-3">
          <span class="portal-icon">
            <Building2 class="size-5" aria-hidden="true" />
          </span>
          <div>
            <p class="font-semibold text-brand-navy-900">Portal Razcon</p>
            <p class="text-xs text-text-muted">Visão geral da sua empresa</p>
          </div>
        </div>

        <div
          class="mt-8 rounded-[var(--radius-md)] border border-border bg-surface-muted p-4"
        >
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-xs text-text-muted">Próxima obrigação</p>
              <p class="mt-1 font-semibold text-brand-navy-900">DAS — Simples Nacional</p>
            </div>
            <span class="portal-badge bg-warning/10 text-warning">Em breve</span>
          </div>
          <div class="mt-5 h-1.5 overflow-hidden rounded-full bg-brand-navy-100">
            <div class="h-full w-2/3 rounded-full bg-brand-navy-900" />
          </div>
          <p class="mt-2 text-right text-xs tabular-nums text-text-muted">
            Vencimento em 8 dias
          </p>
        </div>

        <ul class="mt-8 space-y-5">
          <li class="flex gap-3">
            <span class="portal-icon-sm">
              <FileText class="size-4" aria-hidden="true" />
            </span>
            <div>
              <p class="text-sm font-semibold text-brand-navy-900">
                Documentos organizados
              </p>
              <p class="mt-1 text-xs leading-relaxed text-text-muted">
                Relatórios, guias e arquivos em um só lugar.
              </p>
            </div>
          </li>
          <li class="flex gap-3">
            <span class="portal-icon-sm">
              <CalendarCheck2 class="size-4" aria-hidden="true" />
            </span>
            <div>
              <p class="text-sm font-semibold text-brand-navy-900">Calendário fiscal</p>
              <p class="mt-1 text-xs leading-relaxed text-text-muted">
                Acompanhe entregas, prazos e próximas obrigações.
              </p>
            </div>
          </li>
          <li class="flex gap-3">
            <span class="portal-icon-sm">
              <MessageCircle class="size-4" aria-hidden="true" />
            </span>
            <div>
              <p class="text-sm font-semibold text-brand-navy-900">
                Fale com especialistas
              </p>
              <p class="mt-1 text-xs leading-relaxed text-text-muted">
                Tire dúvidas diretamente com o time Razcon.
              </p>
            </div>
          </li>
        </ul>
      </aside>

      <div class="rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:p-8">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="eyebrow">Área restrita</p>
            <h1 class="mt-2 text-2xl font-semibold tracking-tight text-brand-navy-900">
              {{ formHeading }}
            </h1>
            <p class="mt-2 max-w-md text-sm leading-relaxed text-text-muted">
              {{ formDescription }}
            </p>
          </div>
          <span
            class="hidden size-10 shrink-0 place-items-center rounded-full bg-brand-navy-50 text-brand-navy-900 sm:grid"
          >
            <LockKeyhole class="size-5" aria-hidden="true" />
          </span>
        </div>

        <div
          v-if="notice"
          class="mt-6 flex gap-3 rounded-[var(--radius-md)] bg-brand-navy-50 p-4 text-sm leading-relaxed text-brand-navy-900"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{{ notice }}</span>
        </div>
        <NuxtLink
          v-if="mode === 'login' && notice"
          to="/area-do-cliente/dashboard"
          class="portal-link mt-3"
        >
          Abrir dashboard demonstrativo
          <ArrowRight class="size-4" aria-hidden="true" />
        </NuxtLink>

        <form class="mt-7 grid gap-4" @submit.prevent="submitForm">
          <template v-if="mode === 'signup'">
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="text-sm font-medium text-brand-navy-900" for="full-name">
                Nome completo
                <input
                  id="full-name"
                  required
                  autocomplete="name"
                  class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
                  type="text"
                  placeholder="Seu nome"
                />
              </label>
              <label class="text-sm font-medium text-brand-navy-900" for="company-name">
                Empresa
                <input
                  id="company-name"
                  required
                  autocomplete="organization"
                  class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
                  type="text"
                  placeholder="Nome da empresa"
                />
              </label>
            </div>
          </template>

          <label class="text-sm font-medium text-brand-navy-900" for="client-email">
            E-mail corporativo
            <input
              id="client-email"
              required
              autocomplete="email"
              class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
              type="email"
              placeholder="voce@empresa.com"
            />
          </label>

          <label
            v-if="mode === 'signup'"
            class="text-sm font-medium text-brand-navy-900"
            for="company-document"
          >
            CNPJ
            <input
              id="company-document"
              required
              inputmode="numeric"
              class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
              type="text"
              placeholder="00.000.000/0000-00"
            />
          </label>

          <label
            v-if="mode !== 'recovery'"
            class="text-sm font-medium text-brand-navy-900"
            for="client-password"
          >
            Senha
            <span class="relative mt-1.5 block">
              <input
                id="client-password"
                required
                :autocomplete="mode === 'signup' ? 'new-password' : 'current-password'"
                class="focus-ring w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 pr-11 font-normal"
                :type="passwordVisible ? 'text' : 'password'"
                placeholder="••••••••"
              />
              <button
                class="focus-ring absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-[var(--radius-sm)] text-text-muted hover:text-brand-navy-900"
                type="button"
                :aria-label="passwordVisible ? 'Ocultar senha' : 'Mostrar senha'"
                @click="togglePasswordVisibility"
              >
                <EyeOff v-if="passwordVisible" class="size-4" aria-hidden="true" />
                <Eye v-else class="size-4" aria-hidden="true" />
              </button>
            </span>
          </label>

          <div v-if="mode === 'login'" class="flex items-center justify-between gap-4">
            <label
              class="flex items-center gap-2 text-xs text-text-muted"
              for="remember-client"
            >
              <input
                id="remember-client"
                type="checkbox"
                class="size-4 rounded border-border text-brand-navy-900 focus:ring-brand-gold-400"
              />
              Lembrar acesso
            </label>
            <button
              class="focus-ring rounded-[var(--radius-sm)] text-xs font-semibold text-brand-navy-900 hover:text-brand-navy-700"
              type="button"
              @click="setMode('recovery')"
            >
              Esqueci minha senha
            </button>
          </div>

          <button class="btn-primary focus-ring mt-2 w-full" type="submit">
            {{ submitLabel }}
            <ArrowRight class="ml-2 size-4" aria-hidden="true" />
          </button>
        </form>

        <div class="mt-6 border-t border-border pt-5 text-center text-sm text-text-muted">
          <template v-if="mode === 'login'">
            Ainda não é cliente?
            <button
              class="focus-ring rounded-[var(--radius-sm)] font-semibold text-brand-navy-900 hover:text-brand-navy-700"
              type="button"
              @click="setMode('signup')"
            >
              Criar cadastro
            </button>
          </template>
          <template v-else>
            <button
              class="focus-ring inline-flex items-center gap-1 rounded-[var(--radius-sm)] font-semibold text-brand-navy-900 hover:text-brand-navy-700"
              type="button"
              @click="setMode('login')"
            >
              <ArrowLeft class="size-3.5" aria-hidden="true" />
              Voltar para entrar
            </button>
          </template>
        </div>

        <div
          class="mt-7 flex items-start gap-3 rounded-[var(--radius-md)] border border-border p-3"
        >
          <ShieldCheck
            class="mt-0.5 size-4 shrink-0 text-brand-navy-700"
            aria-hidden="true"
          />
          <p class="text-xs leading-relaxed text-text-muted">
            Seus dados são tratados com segurança e utilizados somente para o atendimento
            da sua empresa.
          </p>
        </div>
      </div>
    </section>

    <section class="border-t border-border bg-surface-muted py-8">
      <div
        class="container-page flex flex-col gap-2 text-center text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between sm:text-left"
      >
        <p>Precisa de ajuda? Fale com a equipe Razcon.</p>
        <NuxtLink to="/faq" class="portal-link"> Acessar perguntas frequentes </NuxtLink>
      </div>
    </section>
  </div>
</template>
