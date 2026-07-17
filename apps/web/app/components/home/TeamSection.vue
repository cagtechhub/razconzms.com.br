<script setup lang="ts">
import { UserRound } from 'lucide-vue-next'

type TeamMember = {
  name: string
  role: string
  initials: string
  tone: string
  image?: string
}

const team: TeamMember[] = [
  {
    name: 'Rita',
    role: 'Diretora',
    initials: 'RT',
    tone: 'bg-brand-navy-100',
    image: undefined
  },
  {
    name: 'Tiago',
    role: 'Especialista contábil',
    initials: 'TA',
    tone: 'bg-brand-gold-100',
    image: '/img/team/tiago.jpeg'
  },
  {
    name: 'Debora',
    role: 'Especialista fiscal',
    initials: 'DE',
    tone: 'bg-brand-gold-100',
    image: '/img/team/marcelo.jpeg'
  },
  {
    name: 'Caroline',
    role: 'Departamento pessoal',
    initials: 'CN',
    tone: 'bg-brand-navy-50',
    image: undefined
  }
]
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

      <div class="mt-14 grid gap-6 md:grid-cols-3">
        <article
          v-for="(person, index) in team"
          :key="person.name"
          class="marketing-card overflow-hidden"
          data-reveal
          :data-reveal-delay="String(index * 80)"
        >
          <div class="relative h-72 overflow-hidden" :class="person.tone">
            <div
              class="absolute left-5 top-5 z-10 rounded-full bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-navy-900 backdrop-blur"
            >
              Equipe Razcon
            </div>
            <template v-if="person.image">
              <img
                :src="person.image"
                :alt="`Foto de ${person.name}`"
                class="absolute inset-0 size-full object-cover object-center transition duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-brand-navy-950/55 via-transparent to-transparent"
                aria-hidden="true"
              />
            </template>
            <div
              v-else
              class="absolute inset-x-0 bottom-0 mx-auto grid size-44 place-items-center rounded-t-full bg-white/75 text-brand-navy-900"
            >
              <UserRound class="size-24 stroke-[1.2] opacity-70" aria-hidden="true" />
              <span
                class="absolute bottom-5 rounded-full bg-brand-navy-900 px-3 py-1 text-xs font-bold text-white"
              >
                {{ person.initials }}
              </span>
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-lg font-semibold text-brand-navy-900">{{ person.name }}</h3>
            <p class="mt-1 text-sm text-text-muted">{{ person.role }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
