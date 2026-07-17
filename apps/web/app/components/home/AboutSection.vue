<script setup lang="ts">
import {
  Eye,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-vue-next'

const pillars = [
  {
    icon: Zap,
    title: 'Praticidade',
    description: 'Resolva pendências com agilidade, de onde estiver, sem perder o fio da meada.'
  },
  {
    icon: Sparkles,
    title: 'Especialista contábil',
    description:
      'Um time preparado para cuidar da sua empresa com atendimento humano e técnico.'
  },
  {
    icon: Eye,
    title: 'Transparência',
    description: 'Acompanhe obrigações, documentos e prazos com clareza — sem surpresas.'
  },
  {
    icon: LockKeyhole,
    title: 'Segurança',
    description:
      'Processos alinhados à conformidade fiscal para você decidir com confiança.'
  }
]
</script>

<template>
  <section id="sobre" class="overflow-hidden bg-surface py-20 sm:py-24">
    <div class="container-page">
      <div class="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <div data-reveal>
          <p class="eyebrow">Por que a Razcon</p>
          <h2 class="section-title">Mais do que cumprir prazos. Entregar confiança.</h2>
          <p class="mt-5 text-base leading-relaxed text-text-muted">
            Combinamos conhecimento técnico, tecnologia e uma conversa próxima para tirar
            o peso da burocracia das suas costas — com a segurança de quem entende o seu
            negócio.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            <div
              class="rounded-[1.25rem] bg-brand-navy-900 p-6 text-white"
              data-reveal
              data-reveal-delay="80"
            >
              <ShieldCheck class="size-7 text-brand-gold-400" aria-hidden="true" />
              <h3 class="mt-6 text-lg font-semibold">Segurança para decidir</h3>
              <p class="mt-2 text-sm leading-relaxed text-white/65">
                Informação organizada e atualizada para você enxergar o que realmente
                importa.
              </p>
            </div>
            <div
              class="rounded-[1.25rem] border border-border bg-surface-muted p-6 sm:mt-8"
              data-reveal
              data-reveal-delay="140"
            >
              <MessageCircle class="size-7 text-brand-navy-900" aria-hidden="true" />
              <h3 class="mt-6 text-lg font-semibold text-brand-navy-900">
                Atendimento próximo
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-text-muted">
                Você fala com pessoas que conhecem sua operação e explicam sem complicar.
              </p>
            </div>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2" data-reveal data-reveal-delay="100">
          <article
            v-for="pillar in pillars"
            :key="pillar.title"
            class="marketing-card p-6"
          >
            <span class="marketing-icon">
              <component :is="pillar.icon" class="size-5" aria-hidden="true" />
            </span>
            <h3 class="mt-5 text-base font-semibold text-brand-navy-900">
              {{ pillar.title }}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-text-muted">
              {{ pillar.description }}
            </p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
