import { checkHealth, createContact } from '../../application/index.js'
import {
  contactSchema,
  createContactSchema,
  healthResponseSchema
} from '@razconms/shared'
import type { ManagedRuntime } from 'effect'
import { Exit } from 'effect'
import express, { type Express } from 'express'
import type { AppServices } from '../../infrastructure/runtime.js'

export const createApp = (
  runtime: ManagedRuntime.ManagedRuntime<AppServices, never>
): Express => {
  const app = express()
  app.use(express.json())
  app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (_req.method === 'OPTIONS') {
      res.sendStatus(204)
      return
    }
    next()
  })

  app.get('/', (_req, res) => {
    res.json({ name: '@razconms/backend', docs: '/health' })
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

    void runtime.runPromiseExit(createContact(parsed.data)).then((exit) => {
      if (Exit.isSuccess(exit)) {
        const payload = contactSchema.parse(exit.value)
        res.status(201).json(payload)
        return
      }
      res.status(500).json({ error: 'internal_error' })
    })
  })

  return app
}
