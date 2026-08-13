<script setup lang="ts">
import type { CreateLeadInput, Lead, LeadChannel, LeadStatus } from '@razconms/shared'

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
const error = ref('')
const loading = ref(true)
const creating = ref(false)
const showForm = ref(false)

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
    leads.value = await api.listLeads()
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
    year: 'numeric'
  })
}

const onStatusChange = async (lead: Lead, status: LeadStatus) => {
  try {
    await api.updateLead(lead.id, { status })
    await load()
  } catch {
    error.value = 'Não foi possível atualizar o status.'
  }
}

const onDelete = async (lead: Lead) => {
  if (!confirm(`Excluir lead de "${lead.fullName}"?`)) return
  try {
    await api.removeLead(lead.id)
    await load()
  } catch {
    error.value = 'Não foi possível excluir o lead.'
  }
}

const resetForm = () => {
  form.fullName = ''
  form.email = ''
  form.phone = ''
  form.notes = ''
  form.channel = 'WEBSITE'
  form.status = 'NEW'
}

const onCreate = async () => {
  creating.value = true
  error.value = ''
  try {
    const payload: CreateLeadInput = {
      fullName: form.fullName,
      email: form.email || null,
      phone: form.phone || null,
      notes: form.notes || null,
      channel: form.channel,
      status: form.status,
      contactId: null
    }
    await api.createLead(payload)
    showForm.value = false
    resetForm()
    await load()
  } catch {
    error.value = 'Falha ao criar lead.'
  } finally {
    creating.value = false
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
        <button
          type="button"
          class="btn-primary focus-ring"
          @click="showForm = !showForm"
        >
          {{ showForm ? 'Cancelar' : 'Novo lead' }}
        </button>
      </div>
    </div>

    <p v-if="error" class="mt-4 text-sm text-danger">{{ error }}</p>

    <form
      v-if="showForm"
      class="mt-6 grid gap-4 rounded-[var(--radius-lg)] border border-border bg-surface p-5 sm:grid-cols-2"
      @submit.prevent="onCreate"
    >
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
      <div class="sm:col-span-2">
        <button type="submit" class="btn-primary focus-ring" :disabled="creating">
          {{ creating ? 'Salvando…' : 'Criar lead' }}
        </button>
      </div>
    </form>

    <p v-if="loading" class="mt-4 text-sm text-text-muted">Carregando…</p>

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
              Nenhum lead cadastrado.
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
            <td class="px-4 py-3">
              <select
                class="focus-ring rounded-[var(--radius-sm)] border border-border bg-surface px-2 py-1"
                :value="lead.status"
                @change="
                  onStatusChange(
                    lead,
                    ($event.target as HTMLSelectElement).value as LeadStatus
                  )
                "
              >
                <option v-for="status in statuses" :key="status" :value="status">
                  {{ statusLabel[status] }}
                </option>
              </select>
            </td>
            <td class="px-4 py-3 tabular-nums text-text-muted">
              {{ formatDate(lead.createdAt) }}
            </td>
            <td class="px-4 py-3 text-right">
              <button
                type="button"
                class="text-sm font-semibold text-danger hover:underline"
                @click="onDelete(lead)"
              >
                Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
