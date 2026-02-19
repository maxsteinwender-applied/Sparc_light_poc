export default defineNuxtConfig({
  ssr: true,
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss', '@primevue/nuxt-module', '@pinia/nuxt', '@vueuse/motion/nuxt'],
  primevue: {
    autoImport: false,
    components: {
      include: ['Chart'],
      exclude: [],
    },
    directives: {
      include: [],
    },
    composables: {
      include: [],
    },
    options: {
      ripple: true,
    },
  },
  runtimeConfig: {
    public: {
      emailjsServiceId: process.env.NUXT_PUBLIC_EMAILJS_SERVICE_ID,
      emailjsTemplateId: process.env.NUXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      emailjsPublicKey: process.env.NUXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      emailFromName: process.env.NUXT_PUBLIC_EMAIL_FROM_NAME || 'Sparc Light POC',
      chartProvider: process.env.NUXT_PUBLIC_CHART_PROVIDER || 'echarts',
      enableHighcharts: process.env.NUXT_PUBLIC_ENABLE_HIGHCHARTS === 'true',
    },
  },
  app: {
    head: {
      title: 'Sparc Light (Nuxt)',
      meta: [
        {
          name: 'description',
          content: 'Sparc Light MVP/POC as Nuxt 3 app with Codex starter contracts',
        },
      ],
    },
  },
})
