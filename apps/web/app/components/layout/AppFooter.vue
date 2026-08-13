<script setup lang="ts">
const year = new Date().getFullYear()
const { contactEmail } = useSiteSettings()
</script>

<template>
  <footer class="border-t border-brand-navy-800 bg-brand-navy-900 text-white">
    <div class="container-page py-12">
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.7fr]">
        <div>
          <LayoutAppLogo variant="footer" />
          <p class="mt-4 max-w-sm text-sm text-white/70">
            Contabilidade para empresas que precisam de precisão, prazos e orientação
            fiscal clara.
          </p>
        </div>

        <div class="text-sm">
          <p class="font-semibold text-white">Navegação</p>
          <div class="mt-3 space-y-2">
            <NuxtLink
              to="/#servicos"
              class="focus-ring block w-fit rounded-[var(--radius-sm)] text-white/70 hover:text-white"
              >Soluções</NuxtLink
            >
            <NuxtLink
              to="/#planos"
              class="focus-ring block w-fit rounded-[var(--radius-sm)] text-white/70 hover:text-white"
              >Planos</NuxtLink
            >
            <NuxtLink
              to="/faq"
              class="focus-ring block w-fit rounded-[var(--radius-sm)] text-white/70 hover:text-white"
              >Perguntas frequentes</NuxtLink
            >
            <NuxtLink
              to="/area-do-cliente"
              class="focus-ring block w-fit rounded-[var(--radius-sm)] text-white/70 hover:text-white"
              >Área do cliente</NuxtLink
            >
          </div>
        </div>

        <div class="text-sm">
          <p class="font-semibold text-white">Contato</p>
          <a
            v-if="contactEmail"
            class="focus-ring mt-2 block rounded-[var(--radius-sm)] text-white/80 transition hover:text-white"
            :href="`mailto:${contactEmail}`"
          >
            {{ contactEmail }}
          </a>
        </div>
      </div>

      <p class="mt-10 border-t border-white/10 pt-6 text-xs text-white/50">
        © {{ year }} Razcon Soluções Contábeis. Todos os direitos reservados.
      </p>
    </div>
  </footer>
</template>
