<script setup lang="ts">
import { Menu, X } from 'lucide-vue-next'

const { whatsappHref } = useWhatsapp()

const navLinks = [
  { label: 'Serviços', href: '/#servicos' },
  { label: 'Sobre', href: '/#sobre' },
  { label: 'Contato', href: '/#contato' }
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

        <a
          :href="whatsappHref"
          class="btn-primary focus-ring hidden md:inline-flex"
          :target="whatsappHref.startsWith('http') ? '_blank' : undefined"
          :rel="whatsappHref.startsWith('http') ? 'noopener noreferrer' : undefined"
        >
          Fale conosco
        </a>

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
      </div>
    </div>
  </header>
</template>
