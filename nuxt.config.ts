export default defineNuxtConfig({
  ssr: true,
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss', '@primevue/nuxt-module', '@pinia/nuxt', '@vueuse/motion/nuxt'],
  primevue: {
    options: {
      ripple: true,
    },
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
      emailjsServiceId:
        process.env.NUXT_PUBLIC_EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID,
      emailjsTemplateId:
        process.env.NUXT_PUBLIC_EMAILJS_TEMPLATE_ID || process.env.VITE_EMAILJS_TEMPLATE_ID,
      emailjsPublicKey:
        process.env.NUXT_PUBLIC_EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY,
      emailFromName:
        process.env.NUXT_PUBLIC_EMAIL_FROM_NAME || process.env.VITE_EMAIL_FROM_NAME || 'Sparc Light POC',
      chartProvider: process.env.NUXT_PUBLIC_CHART_PROVIDER || process.env.VITE_CHART_PROVIDER || 'echarts',
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
