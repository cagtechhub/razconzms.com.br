import tailwindcss from '@tailwindcss/vite'

function envOrigin(value: string | undefined) {
  if (!value) return ''
  try {
    return new URL(value).origin
  } catch {
    return value.replace(/\/$/, '')
  }
}

const publicApiBase =
  process.env.NUXT_PUBLIC_API_BASE?.trim() || 'http://localhost:3001'
const publicApiOrigin = envOrigin(publicApiBase)
const publicSupabaseOrigin = envOrigin(process.env.NUXT_PUBLIC_SUPABASE_URL)

export default defineNuxtConfig({
  srcDir: 'app/',
  compatibilityDate: '2026-04-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/eslint', 'nuxt-security', '@nuxt/image'],
  css: ['~/assets/css/main.css'],
  build: {
    transpile: ['@razconms/shared']
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['45a4-168-232-70-40.ngrok-free.app']
    }
  },
  runtimeConfig: {
    apiBase: process.env.NUXT_API_BASE?.trim() || '',
    public: {
      apiBase: publicApiBase,
      supabaseUrl: '',
      supabaseAnonKey: '',
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
    '/admin/**': {
      robots: false,
      headers: {
        'X-Robots-Tag': 'noindex, nofollow'
      }
    },
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
          'blob:',
          'https:',
          'https://*.google-analytics.com',
          'https://*.facebook.net',
          'https://*.supabase.co'
        ],
        'connect-src': [
          "'self'",
          publicApiOrigin,
          'http://localhost:3001',
          'http://127.0.0.1:3001',
          'https://*.google-analytics.com',
          'https://*.supabase.co',
          'wss://*.supabase.co',
          ...(publicSupabaseOrigin ? [publicSupabaseOrigin] : [])
        ],
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
