import type { NextFunction, Request, Response } from 'express'
import {
  getSupabaseAuthClient,
  parseAllowedAdminEmails
} from '../../infrastructure/supabase/supabase-auth.js'

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.header('authorization') ?? ''
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''

    if (!token) {
      res.status(401).json({ error: 'unauthorized', message: 'Token ausente' })
      return
    }

    const supabase = getSupabaseAuthClient()
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      res
        .status(401)
        .json({ error: 'unauthorized', message: 'Sessão inválida ou expirada' })
      return
    }

    const email = (data.user.email || '').toLowerCase()
    const allowedEmails = parseAllowedAdminEmails()
    if (allowedEmails && (!email || !allowedEmails.has(email))) {
      res.status(403).json({
        error: 'forbidden',
        message: 'Usuário sem permissão de admin'
      })
      return
    }

    const role = data.user.app_metadata?.role
    if (process.env.ADMIN_REQUIRE_ROLE === 'true' && role !== 'admin') {
      res.status(403).json({
        error: 'forbidden',
        message: 'Perfil admin obrigatório'
      })
      return
    }

    ;(req as Request & { adminUser?: { id: string; email?: string } }).adminUser = {
      id: data.user.id,
      email: data.user.email
    }

    next()
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : 'Falha na autenticação'
    if (message.includes('não configurado')) {
      res.status(500).json({ error: 'auth_not_configured', message })
      return
    }
    res.status(401).json({ error: 'unauthorized', message: 'Falha ao validar sessão' })
  }
}
