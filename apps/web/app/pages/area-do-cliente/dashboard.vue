<script setup lang="ts">
import {
  ArrowDownToLine,
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  FileCheck2,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Upload,
  Users,
  X
} from 'lucide-vue-next'
import type { Component } from 'vue'

definePageMeta({
  layout: false
})

useSiteSeoHead({
  title: 'Dashboard do cliente',
  description:
    'Acompanhe obrigações, documentos e mensagens da sua empresa no portal do cliente Razcon.'
})

type NavId = 'visao-geral' | 'relatorios' | 'cadastros'

interface NavItem {
  id: NavId
  label: string
  icon: Component
  description: string
}

const activeNav = ref<NavId>('visao-geral')
const mobileNavOpen = ref(false)

const navItems: NavItem[] = [
  {
    id: 'visao-geral',
    label: 'Visão geral',
    icon: LayoutDashboard,
    description: 'Resumo da situação contábil da sua empresa.'
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: BarChart3,
    description: 'Balancetes, DRE e extratos disponíveis para consulta.'
  },
  {
    id: 'cadastros',
    label: 'Cadastros',
    icon: FolderKanban,
    description: 'Dados cadastrais da empresa, contatos e usuários.'
  }
]

const stats = [
  {
    label: 'Obrigações em dia',
    value: '18',
    helper: '100% do período',
    icon: CheckCircle2,
    iconClass: 'bg-success/10 text-success'
  },
  {
    label: 'Documentos disponíveis',
    value: '42',
    helper: '3 novos este mês',
    icon: FileCheck2,
    iconClass: 'bg-brand-navy-50 text-brand-navy-900'
  },
  {
    label: 'Mensagens abertas',
    value: '02',
    helper: '1 aguardando resposta',
    icon: MessageCircle,
    iconClass: 'bg-brand-gold-50 text-brand-gold-700'
  },
  {
    label: 'Próximo vencimento',
    value: '20/07',
    helper: 'DAS — Simples Nacional',
    icon: Clock3,
    iconClass: 'bg-warning/10 text-warning'
  }
]

const obligations = [
  {
    name: 'DAS — Simples Nacional',
    reference: 'Competência junho/2026',
    date: '20/07/2026',
    status: 'Vence em 6 dias',
    statusClass: 'bg-warning/10 text-warning'
  },
  {
    name: 'EFD-Contribuições',
    reference: 'Competência junho/2026',
    date: '31/07/2026',
    status: 'Agendada',
    statusClass: 'bg-brand-navy-50 text-brand-navy-700'
  },
  {
    name: 'Folha de pagamento',
    reference: 'Competência julho/2026',
    date: '05/08/2026',
    status: 'Em dia',
    statusClass: 'bg-success/10 text-success'
  }
]

const documents = [
  {
    name: 'Balancete — Junho 2026',
    type: 'Relatório contábil',
    date: '12/07/2026',
    size: '428 KB'
  },
  {
    name: 'Guia DAS — Junho 2026',
    type: 'Documento fiscal',
    date: '10/07/2026',
    size: '182 KB'
  },
  {
    name: 'Folha de pagamento — Junho 2026',
    type: 'Departamento pessoal',
    date: '05/07/2026',
    size: '316 KB'
  }
]

const activities = [
  { text: 'Novo balancete disponível', time: 'Hoje, 09:42', icon: FileText },
  {
    text: 'Guia DAS enviada para pagamento',
    time: '10 jul, 14:18',
    icon: ArrowDownToLine
  },
  {
    text: 'Atendimento respondido pela equipe',
    time: '08 jul, 11:05',
    icon: MessageCircle
  }
]

const reports = [
  {
    name: 'Balancete mensal',
    period: 'Junho/2026',
    updatedAt: '12/07/2026',
    format: 'PDF'
  },
  {
    name: 'DRE gerencial',
    period: 'Junho/2026',
    updatedAt: '12/07/2026',
    format: 'PDF'
  },
  {
    name: 'Extrato de obrigações',
    period: '2º trimestre/2026',
    updatedAt: '01/07/2026',
    format: 'XLSX'
  },
  {
    name: 'Relatório de folha',
    period: 'Junho/2026',
    updatedAt: '05/07/2026',
    format: 'PDF'
  }
]

const cadastros = [
  {
    title: 'Empresa',
    description: 'Razão social, CNPJ, regime tributário e endereço fiscal.',
    icon: Building2,
    count: '1 registro'
  },
  {
    title: 'Usuários',
    description: 'Acessos liberados ao portal e permissões de visualização.',
    icon: Users,
    count: '3 usuários'
  },
  {
    title: 'Contatos',
    description: 'Responsáveis financeiros e canais de comunicação preferenciais.',
    icon: MessageCircle,
    count: '2 contatos'
  },
  {
    title: 'Documentos cadastrais',
    description: 'Contrato social, cartão CNPJ e comprovantes anexados.',
    icon: FileText,
    count: '5 arquivos'
  }
]

const activeItem = computed<NavItem>(() => {
  return navItems.find((item) => item.id === activeNav.value) ?? navItems[0]!
})

function selectNav(id: NavId) {
  activeNav.value = id
  mobileNavOpen.value = false
}
</script>

<template>
  <div class="flex min-h-screen bg-surface-muted text-text">
    <!-- Overlay mobile -->
    <button
      v-if="mobileNavOpen"
      class="fixed inset-0 z-40 bg-brand-navy-950/50 lg:hidden"
      type="button"
      aria-label="Fechar menu"
      @click="mobileNavOpen = false"
    />

    <!-- Menu lateral: sticky full-height no desktop, drawer no mobile -->
    <aside
      class="fixed inset-y-0 left-0 z-50 flex h-screen w-[16rem] shrink-0 flex-col border-r border-white/10 bg-brand-navy-950 text-white transition-transform duration-200 lg:sticky lg:top-0 lg:z-0 lg:translate-x-0"
      :class="mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      aria-label="Menu de navegação"
    >
      <div
        class="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 lg:h-20 lg:px-5"
      >
        <LayoutAppLogo variant="footer" compact />
        <button
          class="focus-ring grid size-9 place-items-center rounded-[var(--radius-sm)] text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
          type="button"
          aria-label="Fechar menu"
          @click="mobileNavOpen = false"
        >
          <X class="size-5" aria-hidden="true" />
        </button>
      </div>

      <div class="shrink-0 border-b border-white/10 px-3 py-4 lg:px-4">
        <p
          class="px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-gold-300"
        >
          Empresa ativa
        </p>
        <button
          class="focus-ring mt-2 flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] bg-white/5 px-3 py-2.5 text-left text-sm transition hover:bg-white/10"
          type="button"
        >
          <span class="flex min-w-0 items-center gap-2.5">
            <span
              class="grid size-8 shrink-0 place-items-center rounded-full bg-brand-gold-500 text-xs font-bold text-brand-navy-950"
            >
              SO
            </span>
            <span class="min-w-0">
              <span class="block truncate font-medium">Soluções Origem</span>
              <span class="block truncate text-xs text-white/45">12.345.678/0001-90</span>
            </span>
          </span>
          <ChevronDown class="size-4 shrink-0 text-white/50" aria-hidden="true" />
        </button>
      </div>

      <nav class="min-h-0 flex-1 overflow-y-auto px-3 py-5">
        <p
          class="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35"
        >
          Menu
        </p>
        <ul class="space-y-1">
          <li v-for="item in navItems" :key="item.id">
            <button
              class="focus-ring flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm transition"
              :class="
                activeNav === item.id
                  ? 'bg-white font-semibold text-brand-navy-900'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              "
              type="button"
              :aria-current="activeNav === item.id ? 'page' : undefined"
              @click="selectNav(item.id)"
            >
              <component :is="item.icon" class="size-4 shrink-0" aria-hidden="true" />
              {{ item.label }}
            </button>
          </li>
        </ul>
      </nav>

      <div class="shrink-0 space-y-1 border-t border-white/10 p-3">
        <NuxtLink
          to="/faq"
          class="focus-ring flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm text-white/65 transition hover:bg-white/10 hover:text-white"
        >
          <CircleHelp class="size-4" aria-hidden="true" />
          Central de ajuda
        </NuxtLink>
        <NuxtLink
          to="/area-do-cliente"
          class="focus-ring flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm text-white/65 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut class="size-4" aria-hidden="true" />
          Sair do portal
        </NuxtLink>
      </div>
    </aside>

    <!-- Conteúdo principal -->
    <div class="flex min-h-screen min-w-0 flex-1 flex-col">
      <header
        class="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur"
      >
        <div
          class="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:h-[4.5rem] lg:px-8"
        >
          <div class="flex min-w-0 items-center gap-3">
            <button
              class="focus-ring grid size-10 shrink-0 place-items-center rounded-[var(--radius-sm)] border border-border text-brand-navy-900 lg:hidden"
              type="button"
              :aria-label="mobileNavOpen ? 'Fechar menu' : 'Abrir menu'"
              :aria-expanded="mobileNavOpen"
              @click="mobileNavOpen = !mobileNavOpen"
            >
              <Menu class="size-5" aria-hidden="true" />
            </button>
            <div class="min-w-0">
              <p class="truncate text-xs text-text-muted">Portal do cliente</p>
              <h1 class="truncate text-base font-semibold text-brand-navy-900 lg:text-lg">
                {{ activeItem.label }}
              </h1>
            </div>
          </div>

          <div class="flex shrink-0 items-center gap-2 sm:gap-4">
            <button
              class="focus-ring relative grid size-10 place-items-center rounded-[var(--radius-md)] text-text-muted transition hover:bg-brand-navy-50 hover:text-brand-navy-900"
              type="button"
              aria-label="Notificações"
            >
              <Bell class="size-5" aria-hidden="true" />
              <span
                class="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-brand-gold-500"
                aria-hidden="true"
              />
            </button>
            <div class="hidden h-8 w-px bg-border sm:block" />
            <div class="flex items-center gap-2.5">
              <span
                class="grid size-9 place-items-center rounded-full bg-brand-navy-900 text-xs font-bold text-white"
              >
                JS
              </span>
              <div class="hidden sm:block">
                <p class="text-sm font-semibold text-brand-navy-900">João Silva</p>
                <p class="text-xs text-text-muted">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <!-- Visão geral -->
        <div v-if="activeNav === 'visao-geral'" class="portal-stack">
          <header class="portal-page-header">
            <div>
              <p class="eyebrow">Terça-feira, 14 de julho de 2026</p>
              <h2 class="portal-page-title">Olá, João. Tudo em ordem?</h2>
              <p class="portal-page-desc">
                Resumo da situação contábil da Soluções Origem.
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <a href="#documentos" class="btn-primary focus-ring">
                <Upload class="mr-2 size-4" aria-hidden="true" />
                Enviar documento
              </a>
              <a href="#obrigacoes" class="btn-secondary focus-ring"> Ver calendário </a>
            </div>
          </header>

          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article v-for="stat in stats" :key="stat.label" class="portal-card">
              <div class="flex items-start justify-between gap-3">
                <p class="text-sm text-text-muted">{{ stat.label }}</p>
                <span
                  class="grid size-9 shrink-0 place-items-center rounded-[var(--radius-md)]"
                  :class="stat.iconClass"
                >
                  <component :is="stat.icon" class="size-4" aria-hidden="true" />
                </span>
              </div>
              <p class="mt-5 text-2xl font-semibold tabular-nums text-brand-navy-900">
                {{ stat.value }}
              </p>
              <p class="mt-1 text-xs text-text-muted">{{ stat.helper }}</p>
            </article>
          </div>

          <div class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <section id="obrigacoes" class="portal-panel">
              <div class="portal-panel-header">
                <div>
                  <p class="eyebrow">Agenda fiscal</p>
                  <h2 class="portal-panel-title">Próximas obrigações</h2>
                </div>
                <button class="portal-link focus-ring" type="button">Ver todas</button>
              </div>
              <div class="divide-y divide-border">
                <div
                  v-for="obligation in obligations"
                  :key="obligation.name"
                  class="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                >
                  <div class="flex min-w-0 items-center gap-3">
                    <span class="portal-icon">
                      <CalendarDays class="size-4" aria-hidden="true" />
                    </span>
                    <div class="min-w-0">
                      <p class="truncate text-sm font-semibold text-brand-navy-900">
                        {{ obligation.name }}
                      </p>
                      <p class="mt-1 text-xs text-text-muted">
                        {{ obligation.reference }}
                      </p>
                    </div>
                  </div>
                  <div
                    class="flex items-center justify-between gap-4 pl-12 sm:justify-end sm:pl-0"
                  >
                    <div class="text-left sm:text-right">
                      <p class="text-sm font-semibold tabular-nums text-brand-navy-900">
                        {{ obligation.date }}
                      </p>
                      <span class="portal-badge mt-1" :class="obligation.statusClass">
                        {{ obligation.status }}
                      </span>
                    </div>
                    <ChevronDown
                      class="-rotate-90 size-4 text-text-muted"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section class="portal-panel">
              <div class="portal-panel-header">
                <div>
                  <p class="eyebrow">Acompanhe de perto</p>
                  <h2 class="portal-panel-title">Atividade recente</h2>
                </div>
                <Bell class="size-5 text-brand-gold-600" aria-hidden="true" />
              </div>
              <div class="portal-panel-body">
                <ul class="space-y-5">
                  <li
                    v-for="activity in activities"
                    :key="activity.text"
                    class="flex gap-3"
                  >
                    <span class="portal-icon-sm">
                      <component :is="activity.icon" class="size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p class="text-sm font-medium text-brand-navy-900">
                        {{ activity.text }}
                      </p>
                      <p class="mt-1 text-xs text-text-muted">{{ activity.time }}</p>
                    </div>
                  </li>
                </ul>
                <button class="portal-link focus-ring mt-6" type="button">
                  Ver histórico
                  <ArrowRight class="size-4" aria-hidden="true" />
                </button>
              </div>
            </section>
          </div>

          <section id="documentos" class="portal-panel">
            <div class="portal-panel-header">
              <div>
                <p class="eyebrow">Central de arquivos</p>
                <h2 class="portal-panel-title">Documentos recentes</h2>
              </div>
              <div class="flex items-center gap-2">
                <label class="portal-search" for="document-search">
                  <Search class="size-4 shrink-0" aria-hidden="true" />
                  <span class="sr-only">Buscar documento</span>
                  <input id="document-search" type="search" placeholder="Buscar" />
                </label>
                <button
                  class="focus-ring grid size-9 place-items-center rounded-[var(--radius-md)] border border-border text-text-muted transition hover:bg-brand-navy-50 hover:text-brand-navy-900"
                  type="button"
                  aria-label="Mais opções"
                >
                  <MoreHorizontal class="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="portal-table">
                <thead>
                  <tr>
                    <th>Documento</th>
                    <th>Categoria</th>
                    <th>Disponível em</th>
                    <th>Tamanho</th>
                    <th>
                      <span class="sr-only">Ação</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="document in documents" :key="document.name">
                    <td>
                      <div class="flex items-center gap-3">
                        <span class="portal-icon-sm bg-brand-gold-50 text-brand-gold-700">
                          <FileText class="size-4" aria-hidden="true" />
                        </span>
                        <span class="font-medium text-brand-navy-900">{{
                          document.name
                        }}</span>
                      </div>
                    </td>
                    <td class="text-text-muted">{{ document.type }}</td>
                    <td class="tabular-nums text-text-muted">{{ document.date }}</td>
                    <td class="tabular-nums text-text-muted">{{ document.size }}</td>
                    <td class="text-right">
                      <button class="portal-link focus-ring" type="button">
                        <ArrowDownToLine class="size-4" aria-hidden="true" />
                        <span class="sr-only sm:not-sr-only">Baixar</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="portal-panel-footer">
              <button
                class="portal-link focus-ring"
                type="button"
                @click="selectNav('relatorios')"
              >
                Ver todos os documentos
                <ArrowRight class="size-4" aria-hidden="true" />
              </button>
            </div>
          </section>

          <section class="grid gap-4 md:grid-cols-2">
            <div
              class="flex items-start gap-4 rounded-[var(--radius-lg)] bg-brand-navy-900 p-5 text-white sm:p-6"
            >
              <span
                class="grid size-9 shrink-0 place-items-center rounded-[var(--radius-md)] bg-brand-gold-500 text-brand-navy-950"
              >
                <MessageCircle class="size-4" aria-hidden="true" />
              </span>
              <div>
                <p class="text-sm font-semibold">Precisa falar com a Razcon?</p>
                <p class="mt-1 text-sm leading-relaxed text-white/60">
                  Nossa equipe está disponível para ajudar com sua rotina.
                </p>
                <button
                  class="focus-ring mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gold-300 transition hover:text-brand-gold-200"
                  type="button"
                >
                  Abrir atendimento
                  <ArrowRight class="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div
              class="flex items-start gap-4 rounded-[var(--radius-lg)] border border-border bg-brand-navy-50 p-5 sm:p-6"
            >
              <span class="portal-icon bg-surface">
                <ShieldCheck class="size-4" aria-hidden="true" />
              </span>
              <div>
                <p class="text-sm font-semibold text-brand-navy-900">Dados protegidos</p>
                <p class="mt-1 text-sm leading-relaxed text-text-muted">
                  Acesso controlado e informações da sua empresa tratadas com segurança.
                </p>
                <NuxtLink to="/faq" class="portal-link focus-ring mt-4">
                  Saiba mais
                  <ArrowRight class="size-4" aria-hidden="true" />
                </NuxtLink>
              </div>
            </div>
          </section>
        </div>

        <!-- Relatórios -->
        <div v-else-if="activeNav === 'relatorios'" class="portal-stack">
          <header class="portal-page-header">
            <div>
              <p class="eyebrow">Consultas</p>
              <h2 class="portal-page-title">Biblioteca de relatórios</h2>
              <p class="portal-page-desc">{{ activeItem.description }}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <button class="btn-secondary focus-ring" type="button">
                <Upload class="mr-2 size-4" aria-hidden="true" />
                Solicitar relatório
              </button>
            </div>
          </header>

          <section class="portal-panel">
            <div class="portal-panel-header">
              <div>
                <p class="eyebrow">Biblioteca</p>
                <h3 class="portal-panel-title">Relatórios disponíveis</h3>
              </div>
              <label class="portal-search" for="report-search">
                <Search class="size-4 shrink-0" aria-hidden="true" />
                <span class="sr-only">Buscar relatório</span>
                <input id="report-search" type="search" placeholder="Buscar" />
              </label>
            </div>
            <div class="overflow-x-auto">
              <table class="portal-table">
                <thead>
                  <tr>
                    <th>Relatório</th>
                    <th>Período</th>
                    <th>Atualizado em</th>
                    <th>Formato</th>
                    <th>
                      <span class="sr-only">Ação</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="report in reports" :key="report.name">
                    <td>
                      <div class="flex items-center gap-3">
                        <span class="portal-icon-sm">
                          <BarChart3 class="size-4" aria-hidden="true" />
                        </span>
                        <span class="font-medium text-brand-navy-900">{{
                          report.name
                        }}</span>
                      </div>
                    </td>
                    <td class="text-text-muted">{{ report.period }}</td>
                    <td class="tabular-nums text-text-muted">{{ report.updatedAt }}</td>
                    <td>
                      <span class="portal-badge bg-brand-navy-50 text-brand-navy-700">
                        {{ report.format }}
                      </span>
                    </td>
                    <td class="text-right">
                      <button class="portal-link focus-ring" type="button">
                        <ArrowDownToLine class="size-4" aria-hidden="true" />
                        <span class="sr-only sm:not-sr-only">Baixar</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <!-- Cadastros -->
        <div v-else class="portal-stack">
          <header class="portal-page-header">
            <div>
              <p class="eyebrow">Gestão</p>
              <h2 class="portal-page-title">Cadastros da empresa</h2>
              <p class="portal-page-desc">{{ activeItem.description }}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <button class="btn-primary focus-ring" type="button">Novo cadastro</button>
            </div>
          </header>

          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article
              v-for="cadastro in cadastros"
              :key="cadastro.title"
              class="portal-card flex flex-col transition hover:border-brand-navy-200"
            >
              <span class="portal-icon">
                <component :is="cadastro.icon" class="size-4" aria-hidden="true" />
              </span>
              <h3 class="mt-4 text-base font-semibold text-brand-navy-900">
                {{ cadastro.title }}
              </h3>
              <p class="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
                {{ cadastro.description }}
              </p>
              <div
                class="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4"
              >
                <span class="text-xs text-text-muted">{{ cadastro.count }}</span>
                <button class="portal-link focus-ring" type="button">
                  Abrir
                  <ArrowRight class="size-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
