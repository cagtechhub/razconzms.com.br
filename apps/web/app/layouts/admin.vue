<script setup lang="ts">
const route = useRoute()
const { logout } = useAdminApi()

const links = [
  { to: '/admin', label: 'Visão geral', exact: true },
  { to: '/admin/leads', label: 'Leads' },
  { to: '/admin/equipe', label: 'Equipe' },
  { to: '/admin/planos', label: 'Planos' },
  { to: '/admin/configuracoes', label: 'Configurações' }
]

const isActive = (to: string, exact = false) => {
  if (exact) return route.path === to
  return route.path === to || route.path.startsWith(`${to}/`)
}

const onLogout = async () => {
  await logout()
  await navigateTo('/admin/login')
}

useHead({
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})
</script>

<template>
  <div class="min-h-screen bg-surface-muted text-text">
    <header
      class="sticky top-0 z-40 border-b border-white/10 bg-brand-navy-950 text-white"
    >
      <div
        class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4"
      >
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-brand-gold-400">Painel</p>
          <h1 class="text-xl font-semibold text-white">Razcon Admin</h1>
        </div>
        <nav class="flex flex-wrap items-center gap-2">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="rounded-[var(--radius-md)] px-3 py-1.5 text-sm transition"
            :class="
              isActive(link.to, link.exact)
                ? 'bg-white/15 font-semibold text-brand-gold-300'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            "
          >
            {{ link.label }}
          </NuxtLink>
          <button
            type="button"
            class="rounded-[var(--radius-md)] border border-white/20 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10"
            @click="onLogout"
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-7xl px-5 py-8">
      <slot />
    </main>
  </div>
</template>
