import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  srcDir: 'app/',
  compatibilityDate: '2026-04-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/eslint', 'nuxt-security', '@nuxt/image'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['45a4-168-232-70-40.ngrok-free.app']
    }
  },
  runtimeConfig: {
    public: {
      siteUrl: '',
      siteName: 'Razcon Soluções Contábeis',
      noIndex: false,
      seoLocality: 'Brasil',
      businessAddress: '',
      businessPhone: '',
      contactEmail: 'contato@razconms.com.br',
      whatsappNumber: '',
      whatsappMessage:
        'Olá! Gostaria de saber mais sobre os serviços contábeis da Razcon.',
      instagramUrl: '',
      facebookUrl: '',
      linkedinUrl: '',
      defaultOgImageUrl: '',
      ga4MeasurementId: '',
      metaPixelId: ''
    }
  },
  app: {
    head: {
      titleTemplate: '%s | Razcon Soluções Contábeis',
      htmlAttrs: { lang: 'pt-BR' }
    }
  },
  routeRules: {
    '/img/**': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable'
      }
    },
    '/favicon.png': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable'
      }
    }
  },
  security: {
    enabled: true,
    headers: {
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'https://www.googletagmanager.com',
          'https://connect.facebook.net',
          'https://wa.me'
        ],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'style-src-elem': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'img-src': [
          "'self'",
          'data:',
          'https://*.google-analytics.com',
          'https://*.facebook.net'
        ],
        'connect-src': ["'self'", 'https://*.google-analytics.com'],
        'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'report-uri': '/csp-report'
      },
      xFrameOptions: 'DENY',
      xContentTypeOptions: 'nosniff',
      referrerPolicy: 'no-referrer',
      permissionsPolicy: {
        camera: [],
        microphone: [],
        geolocation: []
      },
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubdomains: true,
        preload: true
      },
      xPermittedCrossDomainPolicies: 'none',
      xDownloadOptions: 'noopen'
    }
  }
})
