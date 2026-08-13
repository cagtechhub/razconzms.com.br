export function useWhatsapp(customMessage?: string) {
  const settings = useSiteSettings()

  const buildHref = (message?: string) => {
    const digits = settings.whatsappNumber.value.replace(/\D/g, '')
    const text = encodeURIComponent(
      message ||
        settings.whatsappMessage.value ||
        'Olá! Gostaria de saber mais sobre os serviços contábeis da Razcon.'
    )
    return digits ? `https://wa.me/${digits}?text=${text}` : '#contato'
  }

  const whatsappHref = computed(() => buildHref(customMessage))

  return { whatsappHref, buildHref }
}
