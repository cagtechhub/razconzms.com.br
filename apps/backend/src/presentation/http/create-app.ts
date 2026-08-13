import {
  adminDashboardStatsSchema,
  contactSchema,
  createContactSchema,
  createLeadSchema,
  createPlanSchema,
  createTeamMemberSchema,
  healthResponseSchema,
  leadActivitySchema,
  leadSchema,
  listLeadsQuerySchema,
  planSchema,
  siteSettingsSchema,
  teamMemberSchema,
  updateLeadSchema,
  updatePlanSchema,
  updateSiteSettingsSchema,
  updateTeamMemberSchema
} from '@razconms/shared'
import { Cause, Exit, type Effect, type ManagedRuntime } from 'effect'
import express, {
  type Express,
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response
} from 'express'
import multer from 'multer'
import {
  checkHealth,
  createContact,
  createLead,
  createPlan,
  createTeamMember,
  deleteLead,
  deletePlan,
  deleteTeamMember,
  getAdminDashboardStats,
  getLeadById,
  getPlanById,
  getSiteSettings,
  getTeamMemberById,
  listLeadActivities,
  listLeads,
  listPlans,
  listTeamMembers,
  updateLead,
  updatePlan,
  updateSiteSettings,
  updateTeamMember
} from '../../application/index.js'
import type { AppServices } from '../../infrastructure/runtime.js'
import { uploadImageBuffer } from '../../infrastructure/supabase/supabase-storage.js'
import { requireAdmin } from './require-admin.js'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.mimetype)) {
      cb(new Error('Tipo de arquivo inválido. Use JPEG, PNG, WebP ou GIF.'))
      return
    }
    cb(null, true)
  }
})

const uploadSingleImage = upload.single('file') as unknown as RequestHandler

const parseUploadFile = (req: Request, res: Response, next: NextFunction) => {
  uploadSingleImage(req, res, (err?: unknown) => {
    if (!err) {
      next()
      return
    }
    const message = err instanceof Error ? err.message : 'Falha ao processar o arquivo.'
    res.status(400).json({ error: 'upload_error', message })
  })
}

const allowedOrigins = () => {
  const origins = [
    process.env.NUXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ]
    .map((value) => value?.trim().replace(/\/$/, ''))
    .filter((value): value is string => Boolean(value))
  return new Set(origins)
}

const failureMessage = (exit: Exit.Exit<unknown, unknown>, fallback: string) => {
  if (Exit.isSuccess(exit)) return fallback
  const failures = [...Cause.failures(exit.cause), ...Cause.defects(exit.cause)]
  const first = failures[0]
  if (first instanceof Error) return first.message
  if (typeof first === 'string') return first
  return fallback
}

const sendExitError = (
  res: Response,
  exit: Exit.Exit<unknown, unknown>,
  notFoundMessage: string
) => {
  const message = failureMessage(exit, notFoundMessage)
  const isNotFound = message.toLowerCase().includes('not found')
  res.status(isNotFound ? 404 : 500).json({
    error: isNotFound ? 'not_found' : 'internal_error',
    message
  })
}

const runEffect = <A, E>(
  runtime: ManagedRuntime.ManagedRuntime<AppServices, never>,
  effect: Effect.Effect<A, E, AppServices>,
  res: Response,
  onSuccess: (value: A) => void,
  notFoundMessage = 'Resource not found'
) => {
  void runtime.runPromiseExit(effect).then((exit) => {
    if (Exit.isSuccess(exit)) {
      onSuccess(exit.value)
      return
    }
    sendExitError(res, exit, notFoundMessage)
  })
}

export const createApp = (
  runtime: ManagedRuntime.ManagedRuntime<AppServices, never>
): Express => {
  const app = express()
  app.use(express.json({ limit: '2mb' }))
  app.use((req, res, next) => {
    const origin = req.headers.origin?.replace(/\/$/, '')
    const allowlist = allowedOrigins()
    if (origin && allowlist.has(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin)
      res.setHeader('Vary', 'Origin')
    } else if (!origin) {
      // SSR / same-origin
    } else if (allowlist.size === 0) {
      res.setHeader('Access-Control-Allow-Origin', '*')
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') {
      res.sendStatus(204)
      return
    }
    next()
  })

  app.get('/', (_req, res) => {
    res.json({
      name: '@razconms/backend',
      docs: {
        health: 'GET /health',
        contacts: 'POST /contacts',
        settings: 'GET /settings',
        team: 'GET /team',
        plans: 'GET /plans',
        admin: '/admin/*'
      }
    })
  })

  app.get('/health', (_req, res) => {
    void runtime.runPromiseExit(checkHealth).then((exit) => {
      if (Exit.isSuccess(exit)) {
        const payload = healthResponseSchema.parse({
          status: 'ok',
          ...exit.value
        })
        res.status(200).json(payload)
        return
      }
      const payload = healthResponseSchema.parse({
        status: 'degraded',
        api: 'ok',
        database: 'error'
      })
      res.status(503).json(payload)
    })
  })

  app.post('/contacts', (req, res) => {
    const parsed = createContactSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: 'validation_error',
        issues: parsed.error.flatten().fieldErrors
      })
      return
    }

    runEffect(runtime, createContact(parsed.data), res, (contact) => {
      res.status(201).json(contactSchema.parse(contact))
    })
  })

  app.get('/settings', (_req, res) => {
    runEffect(runtime, getSiteSettings, res, (item) => {
      res.json(siteSettingsSchema.parse(item))
    })
  })

  app.get('/team', (_req, res) => {
    runEffect(runtime, listTeamMembers({ activeOnly: true }), res, (items) => {
      res.json(items.map((item) => teamMemberSchema.parse(item)))
    })
  })

  app.get('/plans', (_req, res) => {
    runEffect(runtime, listPlans({ activeOnly: true }), res, (items) => {
      res.json(items.map((item) => planSchema.parse(item)))
    })
  })

  app.get('/admin/dashboard', requireAdmin, (_req, res) => {
    runEffect(runtime, getAdminDashboardStats, res, (stats) => {
      res.json(adminDashboardStatsSchema.parse(stats))
    })
  })

  app.get('/admin/leads', requireAdmin, (req, res) => {
    const parsed = listLeadsQuerySchema.safeParse(req.query)
    if (!parsed.success) {
      res.status(400).json({
        error: 'validation_error',
        issues: parsed.error.flatten().fieldErrors
      })
      return
    }
    runEffect(runtime, listLeads(parsed.data), res, (items) => {
      res.json(items.map((item) => leadSchema.parse(item)))
    })
  })

  app.get('/admin/leads/:id/activities', requireAdmin, (req, res) => {
    runEffect(
      runtime,
      listLeadActivities(req.params.id),
      res,
      (items) => {
        res.json(items.map((item) => leadActivitySchema.parse(item)))
      },
      'Lead not found'
    )
  })

  app.get('/admin/leads/:id', requireAdmin, (req, res) => {
    runEffect(
      runtime,
      getLeadById(req.params.id),
      res,
      (item) => {
        res.json(leadSchema.parse(item))
      },
      'Lead not found'
    )
  })

  app.post('/admin/leads', requireAdmin, (req, res) => {
    const parsed = createLeadSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: 'validation_error',
        issues: parsed.error.flatten().fieldErrors
      })
      return
    }
    runEffect(runtime, createLead(parsed.data), res, (item) => {
      res.status(201).json(leadSchema.parse(item))
    })
  })

  app.put('/admin/leads/:id', requireAdmin, (req, res) => {
    const parsed = updateLeadSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: 'validation_error',
        issues: parsed.error.flatten().fieldErrors
      })
      return
    }
    runEffect(
      runtime,
      updateLead(req.params.id, parsed.data),
      res,
      (item) => {
        res.json(leadSchema.parse(item))
      },
      'Lead not found'
    )
  })

  app.delete('/admin/leads/:id', requireAdmin, (req, res) => {
    runEffect(
      runtime,
      deleteLead(req.params.id),
      res,
      () => {
        res.status(204).send()
      },
      'Lead not found'
    )
  })

  app.get('/admin/settings', requireAdmin, (_req, res) => {
    runEffect(runtime, getSiteSettings, res, (item) => {
      res.json(siteSettingsSchema.parse(item))
    })
  })

  app.put('/admin/settings', requireAdmin, (req, res) => {
    const parsed = updateSiteSettingsSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: 'validation_error',
        issues: parsed.error.flatten().fieldErrors
      })
      return
    }
    runEffect(runtime, updateSiteSettings(parsed.data), res, (item) => {
      res.json(siteSettingsSchema.parse(item))
    })
  })

  app.get('/admin/team', requireAdmin, (_req, res) => {
    runEffect(runtime, listTeamMembers(), res, (items) => {
      res.json(items.map((item) => teamMemberSchema.parse(item)))
    })
  })

  app.get('/admin/team/:id', requireAdmin, (req, res) => {
    runEffect(
      runtime,
      getTeamMemberById(req.params.id),
      res,
      (item) => {
        res.json(teamMemberSchema.parse(item))
      },
      'Team member not found'
    )
  })

  app.post('/admin/team', requireAdmin, (req, res) => {
    const parsed = createTeamMemberSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: 'validation_error',
        issues: parsed.error.flatten().fieldErrors
      })
      return
    }
    runEffect(runtime, createTeamMember(parsed.data), res, (item) => {
      res.status(201).json(teamMemberSchema.parse(item))
    })
  })

  app.put('/admin/team/:id', requireAdmin, (req, res) => {
    const parsed = updateTeamMemberSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: 'validation_error',
        issues: parsed.error.flatten().fieldErrors
      })
      return
    }
    runEffect(
      runtime,
      updateTeamMember(req.params.id, parsed.data),
      res,
      (item) => {
        res.json(teamMemberSchema.parse(item))
      },
      'Team member not found'
    )
  })

  app.delete('/admin/team/:id', requireAdmin, (req, res) => {
    runEffect(
      runtime,
      deleteTeamMember(req.params.id),
      res,
      () => {
        res.status(204).send()
      },
      'Team member not found'
    )
  })

  app.get('/admin/plans', requireAdmin, (_req, res) => {
    runEffect(runtime, listPlans(), res, (items) => {
      res.json(items.map((item) => planSchema.parse(item)))
    })
  })

  app.get('/admin/plans/:id', requireAdmin, (req, res) => {
    runEffect(
      runtime,
      getPlanById(req.params.id),
      res,
      (item) => {
        res.json(planSchema.parse(item))
      },
      'Plan not found'
    )
  })

  app.post('/admin/plans', requireAdmin, (req, res) => {
    const parsed = createPlanSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: 'validation_error',
        issues: parsed.error.flatten().fieldErrors
      })
      return
    }
    runEffect(runtime, createPlan(parsed.data), res, (item) => {
      res.status(201).json(planSchema.parse(item))
    })
  })

  app.put('/admin/plans/:id', requireAdmin, (req, res) => {
    const parsed = updatePlanSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: 'validation_error',
        issues: parsed.error.flatten().fieldErrors
      })
      return
    }
    runEffect(
      runtime,
      updatePlan(req.params.id, parsed.data),
      res,
      (item) => {
        res.json(planSchema.parse(item))
      },
      'Plan not found'
    )
  })

  app.delete('/admin/plans/:id', requireAdmin, (req, res) => {
    runEffect(
      runtime,
      deletePlan(req.params.id),
      res,
      () => {
        res.status(204).send()
      },
      'Plan not found'
    )
  })

  app.post('/admin/uploads', requireAdmin, parseUploadFile, async (req, res) => {
    const file = req.file
    if (!file) {
      res.status(400).json({ error: 'validation_error', message: 'Arquivo ausente' })
      return
    }

    const folder =
      typeof req.body?.folder === 'string' && req.body.folder.trim()
        ? req.body.folder.trim()
        : 'team'

    try {
      const uploaded = await uploadImageBuffer({
        buffer: file.buffer,
        mimeType: file.mimetype,
        folder,
        originalName: file.originalname
      })
      res.status(201).json(uploaded)
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Falha no upload'
      const status =
        message.includes('não configurado') || message.includes('Defina') ? 500 : 400
      res.status(status).json({ error: 'upload_error', message })
    }
  })

  return app
}
