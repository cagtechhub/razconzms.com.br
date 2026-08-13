<script setup lang="ts">
import { Facebook, Instagram, Linkedin } from 'lucide-vue-next'
import type { TeamMember } from '@razconms/shared'

const { data: team, status } = await useAsyncData('public-team', async () => {
  const base = resolveApiBase()
  if (!base) return [] as TeamMember[]
  try {
    return await $fetch<TeamMember[]>(`${base}/team`)
  } catch {
    return [] as TeamMember[]
  }
})
</script>

<template>
  <section id="equipe" class="bg-surface-muted py-20 sm:py-24">
    <div class="container-page">
      <div
        class="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        data-reveal
      >
        <div class="max-w-xl">
          <p class="eyebrow">Quem está com você</p>
          <h2 class="section-title">Por trás de cada solução, um time comprometido</h2>
        </div>
        <p class="max-w-sm text-sm leading-relaxed text-text-muted sm:text-right">
          Especialistas em diferentes áreas trabalhando juntos para deixar sua empresa
          mais leve.
        </p>
      </div>

      <p v-if="status === 'pending'" class="mt-14 text-sm text-text-muted">
        Carregando equipe…
      </p>
      <p
        v-else-if="!team?.length"
        class="mt-14 rounded-[var(--radius-lg)] border border-border bg-surface px-5 py-10 text-center text-sm text-text-muted"
      >
        A equipe será publicada em breve.
      </p>

      <div v-else class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="(person, index) in team"
          :key="person.id"
          class="marketing-card overflow-hidden"
          data-reveal
          :data-reveal-delay="String(index * 80)"
        >
          <div class="relative aspect-[3/4] overflow-hidden bg-brand-navy-50">
            <img
              v-if="person.imageUrl"
              :src="person.imageUrl"
              :alt="`Foto de ${person.name}`"
              class="size-full object-cover object-[center_18%]"
              loading="lazy"
              decoding="async"
            />
            <div v-else class="grid size-full place-items-center text-brand-navy-900">
              <span
                class="grid size-20 place-items-center rounded-full bg-brand-navy-900 text-sm font-semibold text-white"
                :aria-label="`Iniciais de ${person.name}`"
              >
                {{ person.initials }}
              </span>
            </div>
          </div>
          <div class="border-t border-border p-5">
            <h3 class="text-base font-semibold text-brand-navy-900">{{ person.name }}</h3>
            <p class="mt-1 text-sm text-text-muted">{{ person.role }}</p>
            <div
              v-if="
                socialHref(person.instagramUrl) ||
                socialHref(person.linkedinUrl) ||
                socialHref(person.facebookUrl)
              "
              class="mt-3 flex gap-2"
            >
              <a
                v-if="socialHref(person.instagramUrl)"
                :href="socialHref(person.instagramUrl) || undefined"
                class="focus-ring rounded-[var(--radius-sm)] p-1 text-brand-navy-900 hover:text-brand-navy-700"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`Instagram de ${person.name}`"
              >
                <Instagram class="size-4" aria-hidden="true" />
              </a>
              <a
                v-if="socialHref(person.linkedinUrl)"
                :href="socialHref(person.linkedinUrl) || undefined"
                class="focus-ring rounded-[var(--radius-sm)] p-1 text-brand-navy-900 hover:text-brand-navy-700"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`LinkedIn de ${person.name}`"
              >
                <Linkedin class="size-4" aria-hidden="true" />
              </a>
              <a
                v-if="socialHref(person.facebookUrl)"
                :href="socialHref(person.facebookUrl) || undefined"
                class="focus-ring rounded-[var(--radius-sm)] p-1 text-brand-navy-900 hover:text-brand-navy-700"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`Facebook de ${person.name}`"
              >
                <Facebook class="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
