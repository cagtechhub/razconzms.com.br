export default defineNuxtPlugin({
  name: 'site-settings',
  enforce: 'pre',
  async setup() {
    await loadSiteSettings()
  }
})
