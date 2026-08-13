<script setup lang="ts">
import type { SiteSettings } from '@razconms/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

useSiteSeoHead({
  title: 'Configurações do site',
  description: 'SEO, contato e analytics da Razcon.'
})

const api = useAdminApi()
const error = ref('')
const success = ref('')
const loading = ref(true)
const saving = ref(false)

const form = reactive({
  siteUrl: '',
  siteName: '',
  seoLocality: '',
  noIndex: false,
  businessAddress: '',
  businessPhone: '',
  contactEmail: '',
  whatsappNumber: '',
  whatsappMessage: '',
  instagramUrl: '',
  facebookUrl: '',
  linkedinUrl: '',
  defaultOgImageUrl: '',
  ga4MeasurementId: '',
  metaPixelId: ''
})

const applySettings = (item: SiteSettings) => {
  form.siteUrl = item.siteUrl
  form.siteName = item.siteName
  form.seoLocality = item.seoLocality
  form.noIndex = item.noIndex
  form.businessAddress = item.businessAddress
  form.businessPhone = item.businessPhone
  form.contactEmail = item.contactEmail
  form.whatsappNumber = item.whatsappNumber
  form.whatsappMessage = item.whatsappMessage
  form.instagramUrl = item.instagramUrl
  form.facebookUrl = item.facebookUrl
  form.linkedinUrl = item.linkedinUrl
  form.defaultOgImageUrl = item.defaultOgImageUrl
  form.ga4MeasurementId = item.ga4MeasurementId
  form.metaPixelId = item.metaPixelId
}

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    applySettings(await api.getSettings())
  } catch {
    error.value = 'Não foi possível carregar as configurações.'
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  saving.value = true
  error.value = ''
  success.value = ''
  try {
    applySettings(await api.updateSettings({ ...form }))
    success.value = 'Configurações salvas.'
  } catch {
    error.value = 'Falha ao salvar configurações.'
  } finally {
    saving.value = false
  }
}

await load()
</script>

<template>
  <div class="portal-stack mx-auto max-w-3xl">
    <header class="portal-page-header">
      <div>
        <p class="eyebrow">Site</p>
        <h2 class="portal-page-title">Configurações</h2>
        <p class="portal-page-desc">
          SEO, contato, redes e analytics usados no site público.
        </p>
      </div>
    </header>

    <p v-if="error" class="text-sm text-danger">{{ error }}</p>
    <p v-else-if="success" class="text-sm text-success">{{ success }}</p>
    <p v-if="loading" class="text-sm text-text-muted">Carregando…</p>

    <form
      v-else
      class="portal-card space-y-4 p-6"
      @submit.prevent="onSubmit"
    >
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="text-sm font-medium text-brand-navy-900 sm:col-span-2">
          Nome do site
          <input
            v-model="form.siteName"
            required
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="text-sm font-medium text-brand-navy-900 sm:col-span-2">
          URL do site
          <input
            v-model="form.siteUrl"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
            placeholder="https://razconms.com.br"
          />
        </label>
        <label class="text-sm font-medium text-brand-navy-900">
          Localidade SEO
          <input
            v-model="form.seoLocality"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label
          class="inline-flex items-center gap-2 self-end pb-2 text-sm text-brand-navy-900"
        >
          <input
            v-model="form.noIndex"
            type="checkbox"
            class="size-4 rounded border-border"
          />
          No-index (bloquear busca)
        </label>
        <label class="text-sm font-medium text-brand-navy-900 sm:col-span-2">
          Endereço comercial
          <input
            v-model="form.businessAddress"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="text-sm font-medium text-brand-navy-900">
          Telefone
          <input
            v-model="form.businessPhone"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="text-sm font-medium text-brand-navy-900">
          E-mail de contato
          <input
            v-model="form.contactEmail"
            type="email"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="text-sm font-medium text-brand-navy-900">
          WhatsApp (DDI+DDD+número)
          <input
            v-model="form.whatsappNumber"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
            placeholder="5567999999999"
          />
        </label>
        <label class="text-sm font-medium text-brand-navy-900">
          Mensagem padrão WhatsApp
          <input
            v-model="form.whatsappMessage"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="text-sm font-medium text-brand-navy-900">
          Instagram
          <input
            v-model="form.instagramUrl"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="text-sm font-medium text-brand-navy-900">
          Facebook
          <input
            v-model="form.facebookUrl"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="text-sm font-medium text-brand-navy-900 sm:col-span-2">
          LinkedIn
          <input
            v-model="form.linkedinUrl"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="text-sm font-medium text-brand-navy-900 sm:col-span-2">
          Imagem Open Graph
          <input
            v-model="form.defaultOgImageUrl"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="text-sm font-medium text-brand-navy-900">
          GA4 Measurement ID
          <input
            v-model="form.ga4MeasurementId"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="text-sm font-medium text-brand-navy-900">
          Meta Pixel ID
          <input
            v-model="form.metaPixelId"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
      </div>
      <button type="submit" class="btn-primary focus-ring" :disabled="saving">
        {{ saving ? 'Salvando…' : 'Salvar configurações' }}
      </button>
    </form>
  </div>
</template>
