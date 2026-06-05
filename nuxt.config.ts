import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@vee-validate/nuxt',
    '@nuxtjs/supabase',
  ],
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  typescript: {
    strict: true,
  },
  app: {
    head: {
      title: 'Milikku - Personal Asset Inventory',
      meta: [
        {
          name: 'description',
          content:
            'Track your valuable belongings, warranty dates, purchase receipts, storage locations, and lending history in one place.',
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
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap',
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/logo.svg',
        },
      ],
    },
  },
});
