<script setup lang="ts">
let observer: IntersectionObserver | null = null

function teardown() {
  observer?.disconnect()
  observer = null
}

function initReveal() {
  teardown()

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const elements = [
    ...document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed="true"])')
  ]

  if (!elements.length) return

  if (reduced) {
    elements.forEach((el) => el.setAttribute('data-revealed', 'true'))
    return
  }

  const reveal = (el: HTMLElement, immediate = false) => {
    const delay = immediate ? 0 : Number(el.dataset.revealDelay || 0)
    if (delay <= 0) {
      el.setAttribute('data-revealed', 'true')
      return
    }
    window.setTimeout(() => el.setAttribute('data-revealed', 'true'), delay)
  }

  for (const el of elements) {
    const rect = el.getBoundingClientRect()
    const inView = rect.top < window.innerHeight * 0.95 && rect.bottom > 0
    if (inView) reveal(el, true)
  }

  document.documentElement.classList.add('js-reveal')

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target as HTMLElement
        reveal(el)
        observer?.unobserve(el)
      }
    },
    { root: null, rootMargin: '0px 0px -5% 0px', threshold: 0.05 }
  )

  for (const el of elements) {
    if (el.getAttribute('data-revealed') === 'true') continue
    observer.observe(el)
  }
}

function schedule() {
  nextTick(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(initReveal)
    })
  })
}

onMounted(schedule)

const route = useRoute()
watch(() => route.fullPath, schedule)

onBeforeUnmount(() => {
  teardown()
  document.documentElement.classList.remove('js-reveal')
})
</script>

<template>
  <span class="sr-only" aria-hidden="true" />
</template>
