<script setup lang="ts">
import type { AdminDashboardStats } from '@razconms/shared'
import { FolderKanban, RefreshCw, Users } from 'lucide-vue-next'

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
    {
      label: 'Leads novos',
      value: stats.value.leadsNew,
      helper: 'Aguardando primeiro contato',
      icon: FolderKanban
    },
    {
      label: 'Leads total',
      value: stats.value.leadsTotal,
      helper: 'Todos os canais',
      icon: FolderKanban
    },
    {
      label: 'Equipe ativa',
      value: stats.value.teamActive,
      helper: 'Exibida no site',
      icon: Users
    },
    {
      label: 'Equipe total',
      value: stats.value.teamTotal,
      helper: 'Inclui inativos',
      icon: Users
    }
  ]
})
</script>

<template>
  <div class="portal-stack">
    <header class="portal-page-header">
      <div>
        <p class="eyebrow">Painel</p>
        <h2 class="portal-page-title">Visão geral</h2>
        <p class="portal-page-desc">Resumo de leads e equipe.</p>
      </div>
      <button type="button" class="btn-secondary focus-ring" @click="load">
        <RefreshCw class="mr-2 size-4" aria-hidden="true" />
        Atualizar
      </button>
    </header>

    <p v-if="error" class="text-sm text-danger">{{ error }}</p>
    <p v-else-if="loading" class="text-sm text-text-muted">Carregando…</p>

    <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article v-for="card in cards" :key="card.label" class="portal-card">
        <div class="flex items-start justify-between gap-3">
          <p class="text-sm text-text-muted">{{ card.label }}</p>
          <span class="portal-icon">
            <component :is="card.icon" class="size-4" aria-hidden="true" />
          </span>
        </div>
        <p class="mt-5 text-2xl font-semibold tabular-nums text-brand-navy-900">
          {{ card.value }}
        </p>
        <p class="mt-1 text-xs text-text-muted">{{ card.helper }}</p>
      </article>
    </div>
  </div>
</template>
