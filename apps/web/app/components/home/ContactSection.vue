<script setup lang="ts">
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-vue-next'

const { whatsappHref } = useWhatsapp()
const config = useRuntimeConfig()
const contactEmail = computed(() =>
  String(config.public.contactEmail || 'contato@razconms.com.br')
)
const businessPhone = computed(() =>
  String(config.public.businessPhone || '(67) 0000-0000')
)
const businessAddress = computed(() =>
  String(config.public.businessAddress || 'Atendimento para empresas em todo o Brasil')
)
const contactSent = ref(false)

function submitContact() {
  contactSent.value = true
}
</script>

<template>
  <section id="contato" class="relative overflow-hidden bg-brand-navy-950 py-20 text-white sm:py-24">
    <div
      class="pointer-events-none absolute -right-20 top-10 size-72 rounded-full bg-brand-gold-500/15 blur-3xl"
      aria-hidden="true"
    />
    <div class="container-page relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
      <div data-reveal>
        <p class="eyebrow text-brand-gold-300">Vamos conversar</p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Descomplique. Cresça. Conte com a Razcon.
        </h2>
        <p class="mt-5 max-w-md leading-relaxed text-white/65">
          Preencha o formulário ou fale diretamente com nosso time. A primeira conversa é
          para entender seu momento.
        </p>
        <div class="mt-8 space-y-4 text-sm text-white/75">
          <a
            :href="'mailto:' + contactEmail"
            class="focus-ring flex w-fit items-center gap-3 rounded-[var(--radius-sm)] hover:text-white"
          >
            <Mail class="size-4 text-brand-gold-400" aria-hidden="true" />
            {{ contactEmail }}
          </a>
          <a
            :href="whatsappHref"
            class="focus-ring flex w-fit items-center gap-3 rounded-[var(--radius-sm)] hover:text-white"
          >
            <Phone class="size-4 text-brand-gold-400" aria-hidden="true" />
            {{ businessPhone }}
          </a>
          <div class="flex items-start gap-3">
            <MapPin
              class="mt-0.5 size-4 shrink-0 text-brand-gold-400"
              aria-hidden="true"
            />
            <span>{{ businessAddress }}</span>
          </div>
        </div>
      </div>

      <div class="grid gap-5 sm:grid-cols-2" data-reveal data-reveal-delay="100">
        <form
          class="rounded-[1.5rem] bg-surface p-6 text-brand-navy-950 shadow-2xl sm:p-7"
          @submit.prevent="submitContact"
        >
          <div
            v-if="contactSent"
            class="mb-5 rounded-[var(--radius-md)] bg-brand-navy-50 p-3 text-sm text-brand-navy-900"
          >
            Recebemos seus dados. Em breve nosso time entra em contato.
          </div>
          <div class="grid gap-4">
            <label class="text-sm font-medium">
              Nome
              <input
                required
                class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 text-sm"
                type="text"
                name="name"
                placeholder="Seu nome"
              />
            </label>
            <label class="text-sm font-medium">
              E-mail
              <input
                required
                class="focus-ring mt-1.5 w-full rounded-[var(--radius-md)] border border-border px-3 py-2.5 text-sm"
                type="email"
                name="email"
                placeholder="voce@empresa.com"
              />
            </label>
            <label class="text-sm font-medium">
              Como podemos ajudar?
              <textarea
                required
                class="focus-ring mt-1.5 min-h-24 w-full resize-y rounded-[var(--radius-md)] border border-border px-3 py-2.5 text-sm"
                name="message"
                placeholder="Conte brevemente sobre sua empresa"
              />
            </label>
            <button class="btn-pill-accent focus-ring mt-1 w-full" type="submit">
              Enviar mensagem
              <ArrowRight class="ml-2 size-4" aria-hidden="true" />
            </button>
          </div>
        </form>

        <div
          class="relative min-h-72 overflow-hidden rounded-[1.5rem] border border-white/10 bg-brand-navy-900 p-6"
        >
          <div
            class="absolute inset-0 opacity-40"
            style="
              background-image:
                linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
              background-size: 32px 32px;
            "
            aria-hidden="true"
          />
          <div class="relative flex h-full min-h-60 flex-col justify-between">
            <div>
              <span
                class="inline-flex items-center gap-2 rounded-full bg-brand-gold-500 px-3 py-1.5 text-xs font-semibold text-brand-navy-950"
              >
                <MapPin class="size-3.5" aria-hidden="true" />
                Brasil
              </span>
              <p class="mt-5 max-w-[14rem] text-sm leading-relaxed text-white/70">
                Onde você estiver, sua contabilidade estará com você — 100% próxima e
                consultiva.
              </p>
            </div>
            <a
              href="https://www.google.com/maps/search/Brasil"
              target="_blank"
              rel="noopener noreferrer"
              class="focus-ring inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
            >
              Abrir no mapa
              <ArrowRight class="size-3.5" aria-hidden="true" />
            </a>
          </div>
          <div
            class="absolute left-[52%] top-[48%] grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-brand-navy-900 bg-brand-gold-500 text-brand-navy-950 shadow-lg animate-float"
          >
            <MapPin class="size-5 fill-current" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
