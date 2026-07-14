<script setup lang="ts">
const config = useRuntimeConfig()
const year = new Date().getFullYear()
const contactEmail = computed(() => String(config.public.contactEmail || '').trim())
</script>

<template>
  <footer class="relative border-t border-brand-navy-800 bg-brand-navy-900 text-white">
    <div
      class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold-500 to-transparent"
    />
    <div class="container-page py-12">
      <div class="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <LayoutAppLogo variant="footer" />
          <p class="mt-4 max-w-sm text-sm text-white/70">
            Contabilidade para empresas que precisam de precisão, prazos e orientação
            fiscal clara.
          </p>
        </div>

        <div class="text-sm">
          <p class="font-semibold text-brand-gold-400">Contato</p>
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
