<script setup lang="ts">
import type { AdminDashboardStats } from '@razconms/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

useSiteSeoHead({
  title: 'Painel admin',
  description: 'Visão geral do painel administrativo da Razcon.'
})

const api = useAdminApi()
const stats = ref<AdminDashboardStats | null>(null)
const error = ref('')
const loading = ref(true)

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    stats.value = await api.getDashboard()
  } catch {
    error.value = 'Não foi possível carregar o dashboard.'
  } finally {
    loading.value = false
  }
}

await load()

const cards = computed(() => {
  if (!stats.value) return []
  return [
    { label: 'Leads novos', value: stats.value.leadsNew },
    { label: 'Leads total', value: stats.value.leadsTotal },
    { label: 'Equipe ativa', value: stats.value.teamActive },
    { label: 'Equipe total', value: stats.value.teamTotal }
  ]
})
</script>

<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="eyebrow">Painel</p>
        <h2 class="mt-2 text-2xl font-semibold text-brand-navy-900">Visão geral</h2>
        <p class="mt-1 text-sm text-text-muted">Resumo de leads e equipe.</p>
      </div>
      <button type="button" class="btn-secondary focus-ring" @click="load">
        Atualizar
      </button>
    </div>

    <p v-if="error" class="mt-4 text-sm text-danger">{{ error }}</p>
    <p v-else-if="loading" class="mt-4 text-sm text-text-muted">Carregando…</p>

    <div v-else class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article
        v-for="card in cards"
        :key="card.label"
        class="rounded-[var(--radius-lg)] border border-border bg-surface p-5"
      >
        <p class="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {{ card.label }}
        </p>
        <p class="mt-2 text-3xl font-semibold tabular-nums text-brand-navy-900">
          {{ card.value }}
        </p>
      </article>
    </div>
  </div>
</template>
