# Razcon Soluções Contábeis — Style Guide

Design system extraído da logo (navy + dourado), pronto para importar em projeto **Nuxt 4 + Tailwind v4**.

## 1. Paleta extraída da logo

Cores dominantes identificadas via clustering k-means na imagem da logo:

| Papel                                   | Hex       | Amostra |
| --------------------------------------- | --------- | ------- |
| Navy (texto "AZCON" e traço do "R")     | `#13192c` | ██      |
| Dourado (contorno do "R" e "CONTÁBEIS") | `#96864f` | ██      |

A partir dessas duas cores-base foram geradas rampas completas (50→950) no padrão Tailwind, mantendo a matiz (_hue_) original e variando apenas luminosidade/saturação — garantindo que todo tom de azul ou dourado no site "converse" com a marca.

## 2. Rampas de cor

### `brand-navy` (primária — usar para header, botões primários, títulos)

| Token          | Hex                     |
| -------------- | ----------------------- |
| brand-navy-50  | `#f3f4f7`               |
| brand-navy-100 | `#e6e8ef`               |
| brand-navy-200 | `#c6cee6`               |
| brand-navy-300 | `#a2afd7`               |
| brand-navy-400 | `#788ac5`               |
| brand-navy-500 | `#4d65b2`               |
| brand-navy-600 | `#3e518e`               |
| brand-navy-700 | `#314172`               |
| brand-navy-800 | `#253155`               |
| brand-navy-900 | `#18203a` ← tom da logo |
| brand-navy-950 | `#0f1424`               |

### `brand-gold` (acento — usar com moderação: CTAs secundários, ícones, destaques "CONTÁBEIS")

| Token          | Hex                     |
| -------------- | ----------------------- |
| brand-gold-50  | `#f7f6f3`               |
| brand-gold-100 | `#eeede7`               |
| brand-gold-200 | `#e4dec8`               |
| brand-gold-300 | `#d3c9a6`               |
| brand-gold-400 | `#bfb07d`               |
| brand-gold-500 | `#ab9754` ← tom da logo |
| brand-gold-600 | `#897943`               |
| brand-gold-700 | `#6d6136`               |
| brand-gold-800 | `#524928`               |
| brand-gold-900 | `#37311a`               |
| brand-gold-950 | `#231f10`               |

### `neutral` (texto secundário, bordas, backgrounds)

| Token       | Hex       |
| ----------- | --------- |
| neutral-50  | `#f4f4f5` |
| neutral-100 | `#e9eaec` |
| neutral-200 | `#d4d5d9` |
| neutral-300 | `#b9bbc1` |
| neutral-400 | `#989ba4` |
| neutral-500 | `#787c87` |
| neutral-600 | `#60636c` |
| neutral-700 | `#4d4f56` |
| neutral-800 | `#3a3b41` |
| neutral-900 | `#26282b` |
| neutral-950 | `#18191b` |

## 3. Aliases semânticos

Definidos em `theme.css` para uso direto em componentes sem precisar decorar a rampa numérica:

```
bg-primary            → brand-navy-900
text-primary-foreground → branco
bg-accent             → brand-gold-500
text-accent-foreground → brand-navy-950
bg-surface            → branco
bg-surface-muted      → neutral-50
border-border         → neutral-200
text-text             → brand-navy-950
text-text-muted       → neutral-700
```

Cores de feedback (sucesso/alerta/erro) **não** vieram da logo — são valores padrão de mercado escolhidos para contraste e acessibilidade em contexto financeiro/contábil:

- `success`: `#1f7a4d` (verde — usado em "conciliado", "pago", "regularizado")
- `warning`: `#b7791f` (âmbar — usado em "pendente", "vencendo")
- `danger`: `#b3261e` (vermelho — usado em "vencido", "erro")

## 4. Uso recomendado por contexto (escritório contemporâneo)

Proporção visual: **~70% navy + branco**, **~20% neutro**, **~10% gold**.

- **Header do site**: `bg-surface`, borda `border-border`, CTA `btn-primary` (navy).
- **Hero institucional**: navy 950, sem glow/blur dourado. Gold **somente** no CTA principal (`btn-pill-accent` / `btn-accent`).
- **Eyebrow em fundo claro**: `eyebrow` (gold-700). Em fundo escuro: `eyebrow-on-dark` (branco/70) — não competir com o CTA.
- **Botões primários do portal** (enviar documento, login): `bg-brand-navy-900`. Gold no portal só se houver um único destaque.
- **Cards / tabelas**: `bg-surface`, borda `border-border`, valores `text-brand-navy-900` + `tabular-nums`.
- **Status fiscal**: `success` / `warning` / `danger` apenas para status — nunca decorativo.
- **Time**: recorte uniforme (`aspect-[3/4]`, `object-cover`), fundo `brand-navy-50`, sem cards dourados.
- **Evitar**: dourado em grandes áreas, `blur-3xl`, sombras “luxo”, múltiplos papéis de gold na mesma tela.

## 5. Tipografia

- Fonte: **Inter** (--font-sans / --font-display), boa legibilidade em tabelas numéricas e extratos.
- Números/valores monetários: usar `tabular-nums` (font-variant-numeric) para alinhamento em colunas.

## 6. Raios de borda

Perfil mais "corporativo/sóbrio" (contabilidade transmite confiança e seriedade), raios discretos:

- `--radius-sm: 0.25rem` — inputs, badges
- `--radius-md: 0.5rem` — botões, cards pequenos
- `--radius-lg: 0.75rem` — cards, modais
- `--radius-xl: 1rem` — painéis grandes/hero

## 7. Como importar no projeto

1. Copie `theme.css` para `app/assets/css/theme.css` (ou pasta equivalente do seu projeto Nuxt).
2. No seu `main.css`/`app.css`:
   ```css
   @import 'tailwindcss';
   @import './theme.css';
   ```
3. Use as classes normalmente: `bg-brand-navy-900`, `text-brand-gold-500`, `border-neutral-200`, `bg-primary`, etc.
4. Nenhuma configuração adicional em `tailwind.config` é necessária — o Tailwind v4 lê os tokens direto do `@theme`.
