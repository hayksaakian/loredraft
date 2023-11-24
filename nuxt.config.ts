// nuxt.config.ts or nuxt.config.js
export default defineNuxtConfig({
  // In Nuxt 3, you no longer need to specify the target as 'static' since it's default behavior
  // The devtools option is set to true by default in development mode, so you can omit it unless you want it enabled in production as well

  // App meta configuration
  app: {
    head: {
      title: 'loredraft',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  // Global CSS
  css: [
    // Your global CSS here
    'bootstrap/dist/css/bootstrap.css',
  ],

  // Plugins
  plugins: [
    // Your plugins here
  ],

  // Auto import components
  components: true,

  // Modules
  modules: [
    // BootstrapVue is not yet available for Nuxt 3. You need to use Bootstrap 5 with Vue components
    '@pinia/nuxt',
  ],

  // Build Configuration
  build: {
    // Your build configuration here
  },
});
