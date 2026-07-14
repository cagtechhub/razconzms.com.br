<script setup lang="ts">
import { MessageCircle, ShieldCheck } from 'lucide-vue-next'
</script>

<template>
  <section
    id="sobre"
    class="overflow-hidden border-b border-border bg-surface-muted py-20 sm:py-24"
  >
    <div class="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
      <div>
        <p class="eyebrow">Por que a Razcon</p>
        <h2 class="section-title">Mais do que cumprir prazos. Entregar confiança.</h2>
        <p class="mt-5 text-base leading-relaxed text-text-muted">
          Acreditamos que contabilidade boa é aquela que você entende. Por isso,
          combinamos conhecimento técnico, tecnologia e uma conversa próxima para tirar o
          peso da burocracia das suas costas.
        </p>
        <div class="mt-8 grid gap-5 sm:grid-cols-2">
          <div>
            <p class="text-3xl font-semibold text-brand-navy-900">15+</p>
            <p class="mt-1 text-sm text-text-muted">anos de experiência</p>
          </div>
          <div>
            <p class="text-3xl font-semibold text-brand-navy-900">98%</p>
            <p class="mt-1 text-sm text-text-muted">de clientes indicariam</p>
          </div>
        </div>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div
          class="rounded-[var(--radius-lg)] bg-brand-navy-900 p-6 text-white sm:translate-y-8"
        >
          <ShieldCheck class="size-7 text-brand-gold-400" aria-hidden="true" />
          <h3 class="mt-8 text-lg font-semibold">Segurança para decidir</h3>
          <p class="mt-2 text-sm leading-relaxed text-white/65">
            Informação organizada e atualizada para você enxergar o que realmente importa.
          </p>
        </div>
        <div class="rounded-[var(--radius-lg)] border border-border bg-surface p-6">
          <MessageCircle class="size-7 text-brand-navy-900" aria-hidden="true" />
          <h3 class="mt-8 text-lg font-semibold text-brand-navy-900">
            Atendimento próximo
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-text-muted">
            Você fala com pessoas que conhecem sua operação e explicam sem complicar.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
