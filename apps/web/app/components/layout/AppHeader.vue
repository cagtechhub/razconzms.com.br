<script setup lang="ts">
import { Menu, X } from 'lucide-vue-next'

const { whatsappHref } = useWhatsapp()

const navLinks = [
  { label: 'Soluções', href: '/#servicos' },
  { label: 'Planos', href: '/#planos' },
  { label: 'Equipe', href: '/#equipe' },
  { label: 'FAQ', href: '/faq' }
]

const mobileOpen = ref(false)

function closeMobileMenu() {
  mobileOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
    <div class="container-page">
      <nav
        class="flex h-16 items-center justify-between sm:h-[4.25rem]"
        aria-label="Navegação principal"
      >
        <LayoutAppLogo />

        <div class="hidden items-center gap-8 md:flex">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.href"
            class="focus-ring rounded-[var(--radius-sm)] text-sm font-medium text-text-muted transition hover:text-brand-navy-900"
            :to="link.href"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <div class="hidden items-center gap-3 md:flex">
          <NuxtLink
            to="/area-do-cliente"
            class="focus-ring rounded-[var(--radius-sm)] px-2 py-2 text-sm font-semibold text-brand-navy-900 transition hover:text-brand-navy-700"
          >
            Área do cliente
          </NuxtLink>
          <a
            :href="whatsappHref"
            class="btn-primary focus-ring"
            :target="whatsappHref.startsWith('http') ? '_blank' : undefined"
            :rel="whatsappHref.startsWith('http') ? 'noopener noreferrer' : undefined"
          >
            Fale conosco
          </a>
        </div>

        <button
          class="focus-ring grid size-10 place-items-center rounded-[var(--radius-sm)] text-brand-navy-900 md:hidden"
          type="button"
          aria-label="Abrir menu"
          @click="mobileOpen = true"
        >
          <Menu class="size-6" aria-hidden="true" />
        </button>
      </nav>
    </div>

    <div
      v-if="mobileOpen"
      class="fixed inset-0 z-50 bg-brand-navy-950/50 md:hidden"
      @click="closeMobileMenu"
    >
      <div
        class="ml-auto flex h-full w-full max-w-xs flex-col bg-surface p-6 shadow-lg"
        @click.stop
      >
        <div class="mb-8 flex items-center justify-between">
          <LayoutAppLogo />
          <button
            class="focus-ring grid size-10 place-items-center rounded-[var(--radius-sm)] text-brand-navy-900"
            type="button"
            aria-label="Fechar menu"
            @click="closeMobileMenu"
          >
            <X class="size-6" aria-hidden="true" />
          </button>
        </div>

        <div class="flex flex-col gap-4">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.href"
            class="focus-ring rounded-[var(--radius-sm)] py-2 text-base font-medium text-text"
            :to="link.href"
            @click="closeMobileMenu"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <a
          :href="whatsappHref"
          class="btn-primary focus-ring mt-8"
          :target="whatsappHref.startsWith('http') ? '_blank' : undefined"
          :rel="whatsappHref.startsWith('http') ? 'noopener noreferrer' : undefined"
          @click="closeMobileMenu"
        >
          Fale conosco
        </a>
        <NuxtLink
          to="/area-do-cliente"
          class="focus-ring mt-4 inline-flex items-center justify-center rounded-[var(--radius-md)] border border-brand-navy-200 px-5 py-2.5 text-sm font-semibold text-brand-navy-900"
          @click="closeMobileMenu"
        >
          Área do cliente
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
