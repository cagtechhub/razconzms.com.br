<script setup lang="ts">
import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-vue-next'

definePageMeta({
  layout: false
})

useSiteSeoHead({
  title: 'Acesso admin',
  description: 'Painel administrativo da Razcon Soluções Contábeis.'
})

const { login, isAuthenticated } = useAdminApi()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

if (import.meta.client && isAuthenticated.value) {
  await navigateTo('/admin')
}

const onSubmit = async () => {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    await navigateTo('/admin')
  } catch (e: unknown) {
    const message =
      e && typeof e === 'object' && 'statusMessage' in e
        ? String((e as { statusMessage?: string }).statusMessage)
        : ''
    error.value = message || 'E-mail ou senha inválidos.'
    await useAdminApi().logout()
  } finally {
    loading.value = false
  }
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
        <p class="text-sm font-medium text-white/80">Painel admin</p>
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
            <ShieldCheck class="size-5" aria-hidden="true" />
          </span>
          <div>
            <p class="font-semibold text-brand-navy-900">Razcon Admin</p>
            <p class="text-xs text-text-muted">Gestão do site e dos leads</p>
          </div>
        </div>
        <ul class="mt-8 space-y-4 text-sm text-text-muted">
          <li>Leads capturados pelo site e registros manuais.</li>
          <li>Equipe, planos e configurações públicas.</li>
          <li>Acesso restrito às contas autorizadas no Supabase.</li>
        </ul>
      </aside>

      <div class="rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:p-8">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="eyebrow">Área restrita</p>
            <h1 class="mt-2 text-2xl font-semibold tracking-tight text-brand-navy-900">
              Bem-vindo de volta
            </h1>
            <p class="mt-2 max-w-md text-sm leading-relaxed text-text-muted">
              Entre com a conta autorizada para gerenciar o painel.
            </p>
          </div>
          <span
            class="hidden size-10 shrink-0 place-items-center rounded-full bg-brand-navy-50 text-brand-navy-900 sm:grid"
          >
            <LockKeyhole class="size-5" aria-hidden="true" />
          </span>
        </div>

        <form class="mt-7 grid gap-4" @submit.prevent="onSubmit">
          <label class="text-sm font-medium text-brand-navy-900" for="admin-email">
            E-mail
            <input
              id="admin-email"
              v-model="email"
              type="email"
              required
              autocomplete="username"
              class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
              placeholder="voce@razconms.com.br"
            />
          </label>
          <label class="text-sm font-medium text-brand-navy-900" for="admin-password">
            Senha
            <input
              id="admin-password"
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
              placeholder="••••••••"
            />
          </label>
          <p v-if="error" class="text-sm text-danger">{{ error }}</p>
          <button type="submit" class="btn-primary focus-ring" :disabled="loading">
            {{ loading ? 'Entrando…' : 'Acessar painel' }}
            <ArrowRight class="ml-2 size-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  </div>
</template>
