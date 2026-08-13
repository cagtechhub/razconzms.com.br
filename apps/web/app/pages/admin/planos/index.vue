<script setup lang="ts">
import type { Plan } from '@razconms/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

useSiteSeoHead({
  title: 'Planos',
  description: 'Gestão dos planos exibidos no site da Razcon.'
})

const api = useAdminApi()
const plans = ref<Plan[]>([])
const error = ref('')
const loading = ref(true)
const saving = ref(false)
const modalOpen = ref(false)
const editingId = ref<string | null>(null)

const form = reactive({
  name: '',
  description: '',
  featuresText: '',
  featured: false,
  showPrice: true,
  priceOriginal: '',
  pricePromo: '',
  sortOrder: 0,
  active: true,
  ctaLabel: ''
})

const resetForm = () => {
  editingId.value = null
  form.name = ''
  form.description = ''
  form.featuresText = ''
  form.featured = false
  form.showPrice = true
  form.priceOriginal = ''
  form.pricePromo = ''
  form.sortOrder = plans.value.length
  form.active = true
  form.ctaLabel = ''
}

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    plans.value = await api.listPlans()
    if (!editingId.value) form.sortOrder = plans.value.length
  } catch {
    error.value = 'Não foi possível carregar os planos.'
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  resetForm()
  modalOpen.value = true
}

const openEdit = (plan: Plan) => {
  editingId.value = plan.id
  form.name = plan.name
  form.description = plan.description
  form.featuresText = plan.features.join('\n')
  form.featured = plan.featured
  form.showPrice = plan.showPrice
  form.priceOriginal = centsToReaisInput(plan.priceOriginalCents)
  form.pricePromo = centsToReaisInput(plan.pricePromoCents)
  form.sortOrder = plan.sortOrder
  form.active = plan.active
  form.ctaLabel = plan.ctaLabel || ''
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  resetForm()
}

const parseFeatures = () =>
  form.featuresText
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

const onSubmit = async () => {
  saving.value = true
  error.value = ''
  try {
    const features = parseFeatures()
    if (!features.length) {
      error.value = 'Informe ao menos um item na lista de benefícios.'
      return
    }
    const payload = {
      name: form.name,
      description: form.description,
      features,
      featured: form.featured,
      showPrice: form.showPrice,
      priceOriginalCents: reaisInputToCents(form.priceOriginal),
      pricePromoCents: reaisInputToCents(form.pricePromo),
      sortOrder: Number(form.sortOrder) || 0,
      active: form.active,
      ctaLabel: form.ctaLabel.trim() || null
    }
    if (editingId.value) {
      await api.updatePlan(editingId.value, payload)
    } else {
      await api.createPlan(payload)
    }
    closeModal()
    await load()
  } catch {
    error.value = 'Falha ao salvar o plano.'
  } finally {
    saving.value = false
  }
}

const onDelete = async (plan: Plan) => {
  if (!confirm(`Excluir o plano "${plan.name}"?`)) return
  try {
    await api.removePlan(plan.id)
    if (editingId.value === plan.id) closeModal()
    await load()
  } catch {
    error.value = 'Não foi possível excluir o plano.'
  }
}

await load()
</script>

<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="eyebrow">Site</p>
        <h2 class="mt-2 text-2xl font-semibold text-brand-navy-900">Planos</h2>
        <p class="mt-1 text-sm text-text-muted">
          Cards públicos, destaque único e preços em centavos.
        </p>
      </div>
      <div class="flex gap-2">
        <button type="button" class="btn-secondary focus-ring" @click="load">
          Atualizar
        </button>
        <button type="button" class="btn-primary focus-ring" @click="openCreate">
          Novo plano
        </button>
      </div>
    </div>

    <p v-if="error" class="mt-4 text-sm text-danger">{{ error }}</p>
    <p v-else-if="loading" class="mt-4 text-sm text-text-muted">Carregando…</p>

    <ul v-else class="mt-6 space-y-3">
      <li
        v-if="!plans.length"
        class="rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-8 text-center text-text-muted"
      >
        Nenhum plano cadastrado.
      </li>
      <li
        v-for="plan in plans"
        :key="plan.id"
        class="rounded-[var(--radius-lg)] border border-border bg-surface p-4"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="font-semibold text-brand-navy-900">
              {{ plan.name }}
              <span
                v-if="plan.featured"
                class="ml-2 rounded-full bg-brand-navy-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
              >
                Destaque
              </span>
            </p>
            <p class="mt-1 text-sm text-text-muted">{{ plan.description }}</p>
            <p class="mt-2 text-sm tabular-nums text-brand-navy-900">
              <template v-if="!plan.showPrice">Preço oculto</template>
              <template v-else-if="plan.pricePromoCents != null">
                <span
                  v-if="plan.priceOriginalCents != null"
                  class="text-text-muted line-through"
                >
                  {{ centsToBrl(plan.priceOriginalCents) }}
                </span>
                {{ centsToBrl(plan.pricePromoCents) }}
              </template>
              <template v-else-if="plan.priceOriginalCents != null">
                {{ centsToBrl(plan.priceOriginalCents) }}
              </template>
              <template v-else>—</template>
            </p>
            <p class="mt-1 text-xs text-text-muted">
              Ordem {{ plan.sortOrder }} · {{ plan.active ? 'Ativo' : 'Inativo' }} ·
              {{ plan.features.length }} benefícios
            </p>
          </div>
          <div class="flex shrink-0 gap-2">
            <button
              type="button"
              class="btn-secondary focus-ring px-3 py-2"
              @click="openEdit(plan)"
            >
              Editar
            </button>
            <button
              type="button"
              class="rounded-[var(--radius-md)] border border-danger/30 px-3 py-2 text-sm font-semibold text-danger hover:bg-danger/5"
              @click="onDelete(plan)"
            >
              Excluir
            </button>
          </div>
        </div>
      </li>
    </ul>

    <AdminModal
      :open="modalOpen"
      wide
      :title="editingId ? 'Editar plano' : 'Novo plano'"
      description="Apenas um plano pode ficar em destaque."
      @close="closeModal"
    >
      <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="onSubmit">
        <label class="text-sm font-medium text-brand-navy-900 sm:col-span-2">
          Nome
          <input
            v-model="form.name"
            required
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="text-sm font-medium text-brand-navy-900 sm:col-span-2">
          Descrição
          <textarea
            v-model="form.description"
            required
            rows="3"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="text-sm font-medium text-brand-navy-900 sm:col-span-2">
          Benefícios (um por linha)
          <textarea
            v-model="form.featuresText"
            required
            rows="5"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="text-sm font-medium text-brand-navy-900">
          Preço original (R$)
          <input
            v-model="form.priceOriginal"
            inputmode="decimal"
            placeholder="399,00"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal tabular-nums"
          />
        </label>
        <label class="text-sm font-medium text-brand-navy-900">
          Preço promocional (R$)
          <input
            v-model="form.pricePromo"
            inputmode="decimal"
            placeholder="349,00"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal tabular-nums"
          />
        </label>
        <label class="text-sm font-medium text-brand-navy-900">
          Ordem
          <input
            v-model.number="form.sortOrder"
            type="number"
            min="0"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="text-sm font-medium text-brand-navy-900">
          Texto do botão
          <input
            v-model="form.ctaLabel"
            placeholder="Conversar sobre este plano"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="flex items-center gap-2 text-sm text-brand-navy-900">
          <input
            v-model="form.showPrice"
            type="checkbox"
            class="size-4 rounded border-border"
          />
          Exibir preço
        </label>
        <label class="flex items-center gap-2 text-sm text-brand-navy-900">
          <input
            v-model="form.featured"
            type="checkbox"
            class="size-4 rounded border-border"
          />
          Plano em destaque
        </label>
        <label class="flex items-center gap-2 text-sm text-brand-navy-900 sm:col-span-2">
          <input
            v-model="form.active"
            type="checkbox"
            class="size-4 rounded border-border"
          />
          Exibir no site
        </label>
        <div class="flex gap-2 sm:col-span-2">
          <button type="submit" class="btn-primary focus-ring" :disabled="saving">
            {{ saving ? 'Salvando…' : editingId ? 'Salvar' : 'Criar plano' }}
          </button>
          <button type="button" class="btn-secondary focus-ring" @click="closeModal">
            Cancelar
          </button>
        </div>
      </form>
    </AdminModal>
  </div>
</template>
