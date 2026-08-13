<script setup lang="ts">
import type {
  CreateLeadInput,
  Lead,
  LeadActivity,
  LeadChannel,
  LeadStatus
} from '@razconms/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

useSiteSeoHead({
  title: 'Leads',
  description: 'Gestão de leads da Razcon.'
})

const api = useAdminApi()
const leads = ref<Lead[]>([])
const activities = ref<LeadActivity[]>([])
const error = ref('')
const loading = ref(true)
const saving = ref(false)
const loadingActivities = ref(false)
const modalOpen = ref(false)
const editing = ref<Lead | null>(null)

const statuses: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST']
const statusLabel: Record<LeadStatus, string> = {
  NEW: 'Novo',
  CONTACTED: 'Contatado',
  QUALIFIED: 'Qualificado',
  CONVERTED: 'Convertido',
  LOST: 'Perdido'
}
const channelLabel: Record<LeadChannel, string> = {
  WEBSITE: 'Site',
  WHATSAPP: 'WhatsApp',
  INSTAGRAM: 'Instagram',
  FACEBOOK: 'Facebook',
  REFERRAL: 'Indicação',
  OTHER: 'Outro'
}
const activityLabel: Record<LeadActivity['type'], string> = {
  CREATED: 'Criado',
  STATUS_CHANGED: 'Status',
  NOTE_ADDED: 'Nota'
}

const filters = reactive({
  status: '' as '' | LeadStatus,
  channel: '' as '' | LeadChannel,
  q: ''
})

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  notes: '',
  channel: 'WEBSITE' as LeadChannel,
  status: 'NEW' as LeadStatus
})

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    leads.value = await api.listLeads({
      status: filters.status || undefined,
      channel: filters.channel || undefined,
      q: filters.q.trim() || undefined,
      limit: 50
    })
  } catch {
    error.value = 'Não foi possível carregar os leads.'
  } finally {
    loading.value = false
  }
}

const formatDate = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const resetForm = () => {
  form.fullName = ''
  form.email = ''
  form.phone = ''
  form.notes = ''
  form.channel = 'WEBSITE'
  form.status = 'NEW'
}

const openCreate = () => {
  editing.value = null
  activities.value = []
  resetForm()
  modalOpen.value = true
}

const openEdit = async (lead: Lead) => {
  editing.value = lead
  form.fullName = lead.fullName
  form.email = lead.email || ''
  form.phone = lead.phone || ''
  form.notes = lead.notes || ''
  form.channel = lead.channel
  form.status = lead.status
  modalOpen.value = true
  loadingActivities.value = true
  try {
    activities.value = await api.listLeadActivities(lead.id)
  } catch {
    activities.value = []
  } finally {
    loadingActivities.value = false
  }
}

const closeModal = () => {
  modalOpen.value = false
  editing.value = null
  activities.value = []
  resetForm()
}

const onSave = async () => {
  saving.value = true
  error.value = ''
  try {
    const payload: CreateLeadInput = {
      fullName: form.fullName,
      email: form.email || null,
      phone: form.phone || null,
      notes: form.notes || null,
      channel: form.channel,
      status: form.status,
      contactId: editing.value?.contactId ?? null
    }
    if (editing.value) {
      await api.updateLead(editing.value.id, payload)
    } else {
      await api.createLead(payload)
    }
    closeModal()
    await load()
  } catch {
    error.value = editing.value ? 'Falha ao atualizar lead.' : 'Falha ao criar lead.'
  } finally {
    saving.value = false
  }
}

const onDelete = async (lead: Lead) => {
  if (!confirm(`Excluir lead de "${lead.fullName}"?`)) return
  try {
    await api.removeLead(lead.id)
    if (editing.value?.id === lead.id) closeModal()
    await load()
  } catch {
    error.value = 'Não foi possível excluir o lead.'
  }
}

await load()
</script>

<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="eyebrow">CRM</p>
        <h2 class="mt-2 text-2xl font-semibold text-brand-navy-900">Leads</h2>
        <p class="mt-1 text-sm text-text-muted">
          Contatos capturados pelo site e registros manuais.
        </p>
      </div>
      <div class="flex gap-2">
        <button type="button" class="btn-secondary focus-ring" @click="load">
          Atualizar
        </button>
        <button type="button" class="btn-primary focus-ring" @click="openCreate">
          Novo lead
        </button>
      </div>
    </div>

    <form
      class="mt-6 grid gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-4 sm:grid-cols-4"
      @submit.prevent="load"
    >
      <label class="text-sm font-medium text-brand-navy-900 sm:col-span-2">
        Busca
        <input
          v-model="filters.q"
          type="search"
          placeholder="Nome, e-mail, telefone ou nota"
          class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
        />
      </label>
      <label class="text-sm font-medium text-brand-navy-900">
        Status
        <select
          v-model="filters.status"
          class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
        >
          <option value="">Todos</option>
          <option v-for="status in statuses" :key="status" :value="status">
            {{ statusLabel[status] }}
          </option>
        </select>
      </label>
      <label class="text-sm font-medium text-brand-navy-900">
        Canal
        <select
          v-model="filters.channel"
          class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
        >
          <option value="">Todos</option>
          <option v-for="(label, value) in channelLabel" :key="value" :value="value">
            {{ label }}
          </option>
        </select>
      </label>
      <div class="sm:col-span-4">
        <button type="submit" class="btn-secondary focus-ring">Filtrar</button>
      </div>
    </form>

    <p v-if="error" class="mt-4 text-sm text-danger">{{ error }}</p>
    <p v-else-if="loading" class="mt-4 text-sm text-text-muted">Carregando…</p>

    <div
      v-else
      class="mt-6 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-surface"
    >
      <table class="min-w-full text-left text-sm">
        <thead class="bg-brand-navy-50 text-text-muted">
          <tr>
            <th class="px-4 py-3 font-medium">Nome</th>
            <th class="px-4 py-3 font-medium">E-mail</th>
            <th class="px-4 py-3 font-medium">Canal</th>
            <th class="px-4 py-3 font-medium">Status</th>
            <th class="px-4 py-3 font-medium">Criado</th>
            <th class="px-4 py-3 font-medium">
              <span class="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!leads.length">
            <td colspan="6" class="px-4 py-8 text-center text-text-muted">
              Nenhum lead encontrado.
            </td>
          </tr>
          <tr v-for="lead in leads" :key="lead.id" class="border-t border-border">
            <td class="px-4 py-3">
              <p class="font-medium text-brand-navy-900">{{ lead.fullName }}</p>
              <p v-if="lead.notes" class="mt-1 line-clamp-2 text-xs text-text-muted">
                {{ lead.notes }}
              </p>
            </td>
            <td class="px-4 py-3 text-text-muted">{{ lead.email || '—' }}</td>
            <td class="px-4 py-3">{{ channelLabel[lead.channel] }}</td>
            <td class="px-4 py-3">{{ statusLabel[lead.status] }}</td>
            <td class="px-4 py-3 tabular-nums text-text-muted">
              {{ formatDate(lead.createdAt) }}
            </td>
            <td class="px-4 py-3 text-right">
              <button
                type="button"
                class="text-sm font-semibold text-brand-navy-900 hover:underline"
                @click="openEdit(lead)"
              >
                Abrir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AdminModal
      :open="modalOpen"
      wide
      :title="editing ? 'Detalhe do lead' : 'Novo lead'"
      :description="
        editing
          ? 'Atualize status, observações e acompanhe a timeline.'
          : 'Cadastre um lead manualmente.'
      "
      @close="closeModal"
    >
      <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="onSave">
        <label class="text-sm font-medium text-brand-navy-900 sm:col-span-2">
          Nome
          <input
            v-model="form.fullName"
            required
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="text-sm font-medium text-brand-navy-900">
          E-mail
          <input
            v-model="form.email"
            type="email"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="text-sm font-medium text-brand-navy-900">
          Telefone
          <input
            v-model="form.phone"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="text-sm font-medium text-brand-navy-900">
          Canal
          <select
            v-model="form.channel"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          >
            <option v-for="(label, value) in channelLabel" :key="value" :value="value">
              {{ label }}
            </option>
          </select>
        </label>
        <label class="text-sm font-medium text-brand-navy-900">
          Status
          <select
            v-model="form.status"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          >
            <option v-for="(label, value) in statusLabel" :key="value" :value="value">
              {{ label }}
            </option>
          </select>
        </label>
        <label class="text-sm font-medium text-brand-navy-900 sm:col-span-2">
          Observações
          <textarea
            v-model="form.notes"
            rows="3"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <div class="flex flex-wrap gap-2 sm:col-span-2">
          <button type="submit" class="btn-primary focus-ring" :disabled="saving">
            {{ saving ? 'Salvando…' : editing ? 'Salvar alterações' : 'Criar lead' }}
          </button>
          <button
            v-if="editing"
            type="button"
            class="rounded-[var(--radius-md)] border border-danger/30 px-4 py-2 text-sm font-semibold text-danger hover:bg-danger/5"
            @click="onDelete(editing)"
          >
            Excluir
          </button>
        </div>
      </form>

      <section v-if="editing" class="mt-8 border-t border-border pt-5">
        <h3 class="text-sm font-semibold text-brand-navy-900">Timeline</h3>
        <p v-if="loadingActivities" class="mt-2 text-sm text-text-muted">Carregando…</p>
        <ol v-else-if="activities.length" class="mt-3 space-y-3">
          <li
            v-for="item in activities"
            :key="item.id"
            class="rounded-[var(--radius-md)] border border-border bg-surface-muted px-3 py-2"
          >
            <p class="text-xs font-semibold uppercase tracking-wider text-text-muted">
              {{ activityLabel[item.type] }} · {{ formatDate(item.createdAt) }}
            </p>
            <p class="mt-1 text-sm text-brand-navy-900">{{ item.message }}</p>
          </li>
        </ol>
        <p v-else class="mt-2 text-sm text-text-muted">Sem atividades registradas.</p>
      </section>
    </AdminModal>
  </div>
</template>
