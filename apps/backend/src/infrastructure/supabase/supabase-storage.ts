import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { randomUUID } from 'node:crypto'
import path from 'node:path'

let serviceClient: SupabaseClient | null = null

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
])

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif'
}

export const getSupabaseServiceClient = (): SupabaseClient => {
  if (serviceClient) return serviceClient
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'Upload indisponível. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.'
    )
  }
  serviceClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  })
  return serviceClient
}

export const resolveStorageBucket = (): string => {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET?.trim()
  if (!bucket) {
    throw new Error('Upload indisponível. Defina SUPABASE_STORAGE_BUCKET no ambiente.')
  }
  return bucket
}

export type UploadedImage = {
  url: string
  path: string
  bucket: string
}

export const uploadImageBuffer = async (input: {
  buffer: Buffer
  mimeType: string
  folder?: string
  originalName?: string
}): Promise<UploadedImage> => {
  if (!ALLOWED_MIME.has(input.mimeType)) {
    throw new Error('Tipo de arquivo inválido. Use JPEG, PNG, WebP ou GIF.')
  }

  const maxBytes = 5 * 1024 * 1024
  if (input.buffer.byteLength > maxBytes) {
    throw new Error('Arquivo muito grande. Máximo 5 MB.')
  }

  const bucket = resolveStorageBucket()
  const folder = (input.folder || 'team').replace(/[^a-z0-9/_-]/gi, '')
  const ext =
    EXT_BY_MIME[input.mimeType] ||
    path.extname(input.originalName || '').replace('.', '') ||
    'jpg'
  const objectPath = `${folder}/${randomUUID()}.${ext}`

  const client = getSupabaseServiceClient()
  const { error } = await client.storage.from(bucket).upload(objectPath, input.buffer, {
    contentType: input.mimeType,
    upsert: false,
    cacheControl: '31536000'
  })

  if (error) {
    throw new Error(error.message || 'Falha no upload para o storage.')
  }

  const { data } = client.storage.from(bucket).getPublicUrl(objectPath)
  if (!data?.publicUrl) {
    throw new Error('Upload concluído, mas a URL pública não foi gerada.')
  }

  return {
    url: data.publicUrl,
    path: objectPath,
    bucket
  }
}
