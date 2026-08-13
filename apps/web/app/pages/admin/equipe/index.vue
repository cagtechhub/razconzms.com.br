<script setup lang="ts">
import type { TeamMember } from '@razconms/shared'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

useSiteSeoHead({
  title: 'Equipe',
  description: 'Gestão da equipe exibida no site da Razcon.'
})

const api = useAdminApi()
const members = ref<TeamMember[]>([])
const error = ref('')
const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const editingId = ref<string | null>(null)

const form = reactive({
  name: '',
  role: '',
  initials: '',
  imageUrl: '',
  storagePath: '',
  sortOrder: 0,
  active: true
})

const resetForm = () => {
  editingId.value = null
  form.name = ''
  form.role = ''
  form.initials = ''
  form.imageUrl = ''
  form.storagePath = ''
  form.sortOrder = members.value.length
  form.active = true
}

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    members.value = await api.listTeam()
    if (!editingId.value) form.sortOrder = members.value.length
  } catch {
    error.value = 'Não foi possível carregar a equipe.'
  } finally {
    loading.value = false
  }
}

const startEdit = (member: TeamMember) => {
  editingId.value = member.id
  form.name = member.name
  form.role = member.role
  form.initials = member.initials
  form.imageUrl = member.imageUrl || ''
  form.storagePath = member.storagePath || ''
  form.sortOrder = member.sortOrder
  form.active = member.active
}

const onUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploading.value = true
  error.value = ''
  try {
    const uploaded = await api.uploadImage(file, 'team')
    form.imageUrl = uploaded.url
    form.storagePath = uploaded.path
  } catch {
    error.value = 'Falha no upload da foto.'
  } finally {
    uploading.value = false
    input.value = ''
  }
}

const onSubmit = async () => {
  saving.value = true
  error.value = ''
  try {
    const payload = {
      name: form.name,
      role: form.role,
      initials: form.initials.toUpperCase(),
      imageUrl: form.imageUrl || null,
      storagePath: form.storagePath || null,
      sortOrder: Number(form.sortOrder) || 0,
      active: form.active
    }
    if (editingId.value) {
      await api.updateTeamMember(editingId.value, payload)
    } else {
      await api.createTeamMember(payload)
    }
    resetForm()
    await load()
  } catch {
    error.value = 'Falha ao salvar membro da equipe.'
  } finally {
    saving.value = false
  }
}

const onDelete = async (member: TeamMember) => {
  if (!confirm(`Excluir ${member.name} da equipe?`)) return
  try {
    await api.removeTeamMember(member.id)
    if (editingId.value === member.id) resetForm()
    await load()
  } catch {
    error.value = 'Não foi possível excluir o membro.'
  }
}

await load()
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-[1fr_22rem]">
    <div>
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="eyebrow">Site</p>
          <h2 class="mt-2 text-2xl font-semibold text-brand-navy-900">Equipe</h2>
          <p class="mt-1 text-sm text-text-muted">
            Membros exibidos na seção pública do site.
          </p>
        </div>
        <button type="button" class="btn-secondary focus-ring" @click="load">
          Atualizar
        </button>
      </div>

      <p v-if="error" class="mt-4 text-sm text-danger">{{ error }}</p>
      <p v-else-if="loading" class="mt-4 text-sm text-text-muted">Carregando…</p>

      <ul v-else class="mt-6 space-y-3">
        <li
          v-for="member in members"
          :key="member.id"
          class="flex items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-surface p-4"
        >
          <img
            v-if="member.imageUrl"
            :src="member.imageUrl"
            :alt="`Foto de ${member.name}`"
            class="size-14 rounded-[var(--radius-md)] object-cover"
          />
          <span
            v-else
            class="grid size-14 place-items-center rounded-[var(--radius-md)] bg-brand-navy-50 text-sm font-bold text-brand-navy-900"
          >
            {{ member.initials }}
          </span>
          <div class="min-w-0 flex-1">
            <p class="font-semibold text-brand-navy-900">{{ member.name }}</p>
            <p class="text-sm text-text-muted">{{ member.role }}</p>
            <p class="mt-1 text-xs text-text-muted">
              Ordem {{ member.sortOrder }} · {{ member.active ? 'Ativo' : 'Inativo' }}
            </p>
          </div>
          <div class="flex shrink-0 gap-2">
            <button
              type="button"
              class="btn-secondary focus-ring px-3 py-2"
              @click="startEdit(member)"
            >
              Editar
            </button>
            <button
              type="button"
              class="rounded-[var(--radius-md)] border border-danger/30 px-3 py-2 text-sm font-semibold text-danger hover:bg-danger/5"
              @click="onDelete(member)"
            >
              Excluir
            </button>
          </div>
        </li>
      </ul>
    </div>

    <form
      class="h-fit rounded-[var(--radius-lg)] border border-border bg-surface p-5"
      @submit.prevent="onSubmit"
    >
      <h3 class="text-lg font-semibold text-brand-navy-900">
        {{ editingId ? 'Editar membro' : 'Novo membro' }}
      </h3>
      <label class="mt-4 block text-sm font-medium text-brand-navy-900">
        Nome
        <input
          v-model="form.name"
          required
          class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
        />
      </label>
      <label class="mt-3 block text-sm font-medium text-brand-navy-900">
        Cargo
        <input
          v-model="form.role"
          required
          class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
        />
      </label>
      <label class="mt-3 block text-sm font-medium text-brand-navy-900">
        Iniciais
        <input
          v-model="form.initials"
          required
          maxlength="4"
          class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal uppercase"
        />
      </label>
      <label class="mt-3 block text-sm font-medium text-brand-navy-900">
        Ordem
        <input
          v-model.number="form.sortOrder"
          type="number"
          min="0"
          class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
        />
      </label>
      <label class="mt-3 block text-sm font-medium text-brand-navy-900">
        Foto
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          class="focus-ring mt-1.5 w-full text-sm"
          @change="onUpload"
        />
      </label>
      <p v-if="uploading" class="mt-1 text-xs text-text-muted">Enviando foto…</p>
      <img
        v-if="form.imageUrl"
        :src="form.imageUrl"
        alt=""
        class="mt-3 h-28 w-full rounded-[var(--radius-md)] object-cover"
      />
      <label class="mt-4 flex items-center gap-2 text-sm text-brand-navy-900">
        <input
          v-model="form.active"
          type="checkbox"
          class="size-4 rounded border-border"
        />
        Exibir no site
      </label>
      <div class="mt-5 flex gap-2">
        <button
          type="submit"
          class="btn-primary focus-ring"
          :disabled="saving || uploading"
        >
          {{ saving ? 'Salvando…' : editingId ? 'Salvar' : 'Adicionar' }}
        </button>
        <button
          v-if="editingId"
          type="button"
          class="btn-secondary focus-ring"
          @click="resetForm"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>
