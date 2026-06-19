export default defineNuxtPlugin((nuxtApp) => {
  // Capture Vue component lifecycle and rendering errors
  nuxtApp.hook('vue:error', (error, instance, info) => {
    console.error('[Vue Runtime Error]:', error)
  })

  // Capture global Nuxt application level errors
  nuxtApp.hook('app:error', (error) => {
    console.error('[Nuxt Application Error]:', error)
  })
})
