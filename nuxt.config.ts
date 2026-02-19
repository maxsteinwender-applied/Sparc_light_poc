import { fileURLToPath } from 'node:url'

const internalNuxtPathsAlias = fileURLToPath(new URL('./internal/nuxt-paths.mjs', import.meta.url))
const internalAppManifestAlias = fileURLToPath(new URL('./internal/app-manifest.mjs', import.meta.url))
const seoTitle =
  process.env.NUXT_PUBLIC_SEO_TITLE ||
  'Sparc Light Prototyp MVP 1.0 | Internal Use only'
const seoDescription =
  process.env.NUXT_PUBLIC_SEO_DESCRIPTION ||
  'Sparc Light Prototyp MVP 1.0 (Internal Use only) – Teil der Deka-Projektinitiative »Wertpapiersparen 2.0«, erstellt von applied by zeb.'
const seoSiteUrl = (process.env.NUXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')
const seoImagePath = process.env.NUXT_PUBLIC_SEO_IMAGE || '/og-image.png'
const normalizedSeoImagePath = seoImagePath.startsWith('/') ? seoImagePath : `/${seoImagePath}`
const seoImageUrl = seoImagePath.startsWith('http') ? seoImagePath : `${seoSiteUrl}${normalizedSeoImagePath}`

export default defineNuxtConfig({
  ssr: true,
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss', '@primevue/nuxt-module', '@pinia/nuxt', '@vueuse/motion/nuxt'],
  alias: {
    '#internal/nuxt/paths': internalNuxtPathsAlias,
    '#app-manifest': internalAppManifestAlias,
  },
  vite: {
    resolve: {
      alias: {
        '#internal/nuxt/paths': internalNuxtPathsAlias,
        '#app-manifest': internalAppManifestAlias,
      },
    },
  },
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
      title: seoTitle,
      meta: [
        {
          name: 'description',
          content: seoDescription,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:title',
          content: seoTitle,
        },
        {
          property: 'og:description',
          content: seoDescription,
        },
        {
          property: 'og:image',
          content: seoImageUrl,
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:title',
          content: seoTitle,
        },
        {
          name: 'twitter:description',
          content: seoDescription,
        },
        {
          name: 'twitter:image',
          content: seoImageUrl,
        },
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,300..700,0..1,-50..200',
        },
      ],
    },
  },
})
