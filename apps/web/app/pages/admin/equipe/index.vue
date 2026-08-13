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
const formError = ref('')
const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const modalOpen = ref(false)
const editingId = ref<string | null>(null)
const previewUrl = ref('')
const previewObjectUrl = ref('')

const form = reactive({
  name: '',
  role: '',
  initials: '',
  imageUrl: '',
  storagePath: '',
  instagramUrl: '',
  linkedinUrl: '',
  facebookUrl: '',
  sortOrder: 0,
  active: true
})

const displayPreview = computed(() => previewUrl.value || form.imageUrl)

const errorMessage = (cause: unknown, fallback: string) => {
  if (cause && typeof cause === 'object' && 'statusMessage' in cause) {
    const message = String((cause as { statusMessage?: string }).statusMessage || '')
    if (message) return message
  }
  if (cause instanceof Error && cause.message) return cause.message
  return fallback
}

const revokePreview = () => {
  if (!previewObjectUrl.value) return
  URL.revokeObjectURL(previewObjectUrl.value)
  previewObjectUrl.value = ''
}

const resetForm = () => {
  editingId.value = null
  formError.value = ''
  revokePreview()
  previewUrl.value = ''
  form.name = ''
  form.role = ''
  form.initials = ''
  form.imageUrl = ''
  form.storagePath = ''
  form.instagramUrl = ''
  form.linkedinUrl = ''
  form.facebookUrl = ''
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

const openCreate = () => {
  resetForm()
  modalOpen.value = true
}

const openEdit = (member: TeamMember) => {
  resetForm()
  editingId.value = member.id
  form.name = member.name
  form.role = member.role
  form.initials = member.initials
  form.imageUrl = member.imageUrl || ''
  form.storagePath = member.storagePath || ''
  form.instagramUrl = member.instagramUrl || ''
  form.linkedinUrl = member.linkedinUrl || ''
  form.facebookUrl = member.facebookUrl || ''
  form.sortOrder = member.sortOrder
  form.active = member.active
  previewUrl.value = member.imageUrl || ''
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  resetForm()
}

const onPickImage = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  revokePreview()
  previewObjectUrl.value = URL.createObjectURL(file)
  previewUrl.value = previewObjectUrl.value
  uploading.value = true
  formError.value = ''

  try {
    const uploaded = await api.uploadImage(file, 'team')
    form.imageUrl = uploaded.url
    form.storagePath = uploaded.path
    revokePreview()
    previewUrl.value = uploaded.url
  } catch (cause) {
    formError.value = errorMessage(cause, 'Falha ao enviar a imagem.')
  } finally {
    uploading.value = false
    input.value = ''
  }
}

const clearImage = () => {
  revokePreview()
  previewUrl.value = ''
  form.imageUrl = ''
  form.storagePath = ''
}

const onSubmit = async () => {
  saving.value = true
  formError.value = ''
  try {
    const payload = {
      name: form.name,
      role: form.role,
      initials: form.initials.toUpperCase(),
      imageUrl: form.imageUrl || null,
      storagePath: form.storagePath || null,
      instagramUrl: form.instagramUrl || null,
      linkedinUrl: form.linkedinUrl || null,
      facebookUrl: form.facebookUrl || null,
      sortOrder: Number(form.sortOrder) || 0,
      active: form.active
    }
    if (editingId.value) {
      await api.updateTeamMember(editingId.value, payload)
    } else {
      await api.createTeamMember(payload)
    }
    closeModal()
    await load()
  } catch (cause) {
    formError.value = errorMessage(cause, 'Falha ao salvar membro da equipe.')
  } finally {
    saving.value = false
  }
}

const onDelete = async (member: TeamMember) => {
  if (!confirm(`Excluir ${member.name} da equipe?`)) return
  try {
    await api.removeTeamMember(member.id)
    if (editingId.value === member.id) closeModal()
    await load()
  } catch (cause) {
    error.value = errorMessage(cause, 'Não foi possível excluir o membro.')
  }
}

onUnmounted(() => {
  revokePreview()
})

await load()
</script>

<template>
  <div class="portal-stack">
    <header class="portal-page-header">
      <div>
        <p class="eyebrow">Site</p>
        <h2 class="portal-page-title">Equipe</h2>
        <p class="portal-page-desc">Membros exibidos na seção pública do site.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button type="button" class="btn-secondary focus-ring" @click="load">
          Atualizar
        </button>
        <button type="button" class="btn-primary focus-ring" @click="openCreate">
          Novo membro
        </button>
      </div>
    </header>

    <p v-if="error" class="text-sm text-danger">{{ error }}</p>
    <p v-else-if="loading" class="text-sm text-text-muted">Carregando…</p>

    <ul v-else class="space-y-3">
      <li
        v-if="!members.length"
        class="portal-card px-4 py-8 text-center text-text-muted"
      >
        Nenhum membro cadastrado.
      </li>
      <li
        v-for="member in members"
        :key="member.id"
        class="portal-card flex items-center gap-4"
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
            @click="openEdit(member)"
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

    <AdminModal
      :open="modalOpen"
      :title="editingId ? 'Editar membro' : 'Novo membro'"
      description="Foto no Supabase e redes sociais opcionais."
      @close="closeModal"
    >
      <p v-if="formError" class="mb-4 text-sm text-danger">{{ formError }}</p>
      <form class="space-y-3" @submit.prevent="onSubmit">
        <div class="space-y-2">
          <p class="text-sm font-medium text-brand-navy-900">Foto</p>
          <div class="flex flex-wrap items-start gap-3">
            <div
              class="flex aspect-[3/4] w-24 items-center justify-center overflow-hidden rounded-[var(--radius-md)] border border-border bg-brand-navy-50"
            >
              <img
                v-if="displayPreview"
                :src="displayPreview"
                alt="Pré-visualização da foto"
                class="size-full object-cover object-[center_18%]"
              />
              <span v-else class="px-2 text-center text-[10px] text-text-muted">
                Sem foto
              </span>
            </div>
            <div class="min-w-0 flex-1 space-y-2">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                class="block w-full text-xs text-text-muted file:mr-3 file:rounded-[var(--radius-md)] file:border-0 file:bg-brand-navy-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-brand-navy-800"
                :disabled="uploading || saving"
                @change="onPickImage"
              />
              <p class="text-[11px] text-text-muted">JPEG, PNG, WebP ou GIF · até 5 MB</p>
              <div class="flex flex-wrap items-center gap-3">
                <button
                  v-if="displayPreview"
                  type="button"
                  class="text-xs font-semibold text-danger hover:underline"
                  :disabled="uploading"
                  @click="clearImage"
                >
                  Remover foto
                </button>
                <span v-if="uploading" class="text-xs text-text-muted">Enviando…</span>
              </div>
              <label class="block text-xs text-text-muted">
                Ou cole uma URL
                <input
                  v-model="form.imageUrl"
                  class="focus-ring mt-1 w-full rounded-[var(--radius-md)] border border-border px-3 py-2 text-sm font-normal text-brand-navy-900"
                  placeholder="https://…"
                  @input="previewUrl = form.imageUrl"
                />
              </label>
            </div>
          </div>
        </div>

        <label class="block text-sm font-medium text-brand-navy-900">
          Nome
          <input
            v-model="form.name"
            required
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="block text-sm font-medium text-brand-navy-900">
          Cargo
          <input
            v-model="form.role"
            required
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="block text-sm font-medium text-brand-navy-900">
          Iniciais
          <input
            v-model="form.initials"
            required
            maxlength="4"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal uppercase"
          />
        </label>
        <label class="block text-sm font-medium text-brand-navy-900">
          Ordem
          <input
            v-model.number="form.sortOrder"
            type="number"
            min="0"
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="block text-sm font-medium text-brand-navy-900">
          Instagram
          <input
            v-model="form.instagramUrl"
            placeholder="https://instagram.com/..."
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="block text-sm font-medium text-brand-navy-900">
          LinkedIn
          <input
            v-model="form.linkedinUrl"
            placeholder="https://linkedin.com/in/..."
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="block text-sm font-medium text-brand-navy-900">
          Facebook
          <input
            v-model="form.facebookUrl"
            placeholder="https://facebook.com/..."
            class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <label class="flex items-center gap-2 text-sm text-brand-navy-900">
          <input
            v-model="form.active"
            type="checkbox"
            class="size-4 rounded border-border"
          />
          Exibir no site
        </label>
        <div class="flex gap-2 pt-2">
          <button
            type="submit"
            class="btn-primary focus-ring"
            :disabled="saving || uploading"
          >
            {{ saving ? 'Salvando…' : editingId ? 'Salvar' : 'Adicionar' }}
          </button>
          <button type="button" class="btn-secondary focus-ring" @click="closeModal">
            Cancelar
          </button>
        </div>
      </form>
    </AdminModal>
  </div>
</template>
