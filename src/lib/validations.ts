import { z } from 'zod'

// ============================================
// UTILITÁRIOS
// ============================================

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// ============================================
// POSTS / NOTÍCIAS
// ============================================

// Helper para ID opcional (aceita CUID, string vazia, null ou undefined)
const optionalCuid = z.preprocess(
  (val) => (val === '' || val === undefined ? null : val),
  z.string().cuid().nullable()
).optional()

// Helper para URL opcional (aceita URL válida, string vazia, null ou undefined)
const optionalUrl = z.preprocess(
  (val) => (val === '' || val === undefined ? null : val),
  z.string().url().nullable()
).optional()

export const postCreateSchema = z.object({
  title: z
    .string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  slug: z
    .string()
    .min(3, 'Slug deve ter pelo menos 3 caracteres')
    .max(200, 'Slug deve ter no máximo 200 caracteres')
    .regex(slugRegex, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  excerpt: z
    .string()
    .min(5, 'Resumo deve ter pelo menos 5 caracteres')
    .max(500, 'Resumo deve ter no máximo 500 caracteres'),
  content: z
    .string()
    .min(10, 'Conteúdo deve ter pelo menos 10 caracteres'),
  coverImage: optionalUrl,
  categoryId: optionalCuid,
  tags: z.array(z.string().cuid('ID de tag inválido')).optional(),
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']).optional(),
})

export const postUpdateSchema = postCreateSchema.partial()

export type PostCreateInput = z.infer<typeof postCreateSchema>
export type PostUpdateInput = z.infer<typeof postUpdateSchema>

// ============================================
// DOCUMENTOS
// ============================================

export const documentCreateSchema = z.object({
  title: z
    .string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  description: z
    .string()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .optional()
    .nullable(),
  fileName: z.string().min(1, 'Nome do arquivo é obrigatório'),
  fileUrl: z.string().url('URL do arquivo inválida'),
  fileSize: z.number().positive('Tamanho do arquivo deve ser positivo'),
  mimeType: z.string().min(1, 'Tipo MIME é obrigatório'),
  type: z.enum(['ATA', 'RESOLUCAO', 'EDITAL', 'PARECER', 'RELATORIO', 'PLANILHA', 'OUTRO']),
  year: z
    .number()
    .int('Ano deve ser um número inteiro')
    .min(2000, 'Ano deve ser maior que 2000')
    .max(2100, 'Ano deve ser menor que 2100')
    .optional()
    .nullable(),
  categoryId: optionalCuid,
})

export const documentUpdateSchema = documentCreateSchema.partial()

export type DocumentCreateInput = z.infer<typeof documentCreateSchema>
export type DocumentUpdateInput = z.infer<typeof documentUpdateSchema>

// ============================================
// EVENTOS
// ============================================

export const eventCreateSchema = z.object({
  title: z
    .string()
    .min(5, 'Título deve ter pelo menos 5 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  slug: z
    .string()
    .min(3, 'Slug deve ter pelo menos 3 caracteres')
    .max(200, 'Slug deve ter no máximo 200 caracteres')
    .regex(slugRegex, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  description: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  location: z.string().max(200).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  startDate: z.string().datetime('Data de início inválida'),
  endDate: z.string().datetime('Data de término inválida').optional().nullable(),
  published: z.boolean().optional(),
})

export const eventUpdateSchema = eventCreateSchema.partial()

export type EventCreateInput = z.infer<typeof eventCreateSchema>
export type EventUpdateInput = z.infer<typeof eventUpdateSchema>

// ============================================
// CATEGORIAS
// ============================================

export const categoryCreateSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  slug: z
    .string()
    .min(2, 'Slug deve ter pelo menos 2 caracteres')
    .max(50, 'Slug deve ter no máximo 50 caracteres')
    .regex(slugRegex, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  description: z.string().max(200, 'Descrição deve ter no máximo 200 caracteres').optional().nullable(),
})

export const categoryUpdateSchema = categoryCreateSchema.partial()

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>

// ============================================
// TAGS
// ============================================

export const tagCreateSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(30, 'Nome deve ter no máximo 30 caracteres'),
  slug: z
    .string()
    .min(2, 'Slug deve ter pelo menos 2 caracteres')
    .max(30, 'Slug deve ter no máximo 30 caracteres')
    .regex(slugRegex, 'Slug deve conter apenas letras minúsculas, números e hífens'),
})

export const tagUpdateSchema = tagCreateSchema.partial()

export type TagCreateInput = z.infer<typeof tagCreateSchema>
export type TagUpdateInput = z.infer<typeof tagUpdateSchema>

// ============================================
// ÁLBUNS / GALERIA
// ============================================

export const albumCreateSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  slug: z
    .string()
    .min(3, 'Slug deve ter pelo menos 3 caracteres')
    .max(100, 'Slug deve ter no máximo 100 caracteres')
    .regex(slugRegex, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  description: z.string().max(500).optional().nullable(),
  coverImage: optionalUrl,
})

export const albumUpdateSchema = albumCreateSchema.partial()

export type AlbumCreateInput = z.infer<typeof albumCreateSchema>
export type AlbumUpdateInput = z.infer<typeof albumUpdateSchema>

// ============================================
// IMAGENS DA GALERIA
// ============================================

export const galleryImageCreateSchema = z.object({
  title: z.string().max(100).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  imageUrl: z.string().url('URL da imagem inválida'),
  thumbnailUrl: optionalUrl,
  order: z.number().int().min(0).optional(),
  albumId: optionalCuid,
})

export const galleryImageUpdateSchema = galleryImageCreateSchema.partial()

export type GalleryImageCreateInput = z.infer<typeof galleryImageCreateSchema>
export type GalleryImageUpdateInput = z.infer<typeof galleryImageUpdateSchema>

// ============================================
// USUÁRIOS
// ============================================

// Regex para senha forte: mínimo 8 caracteres, pelo menos 1 maiúscula, 1 minúscula e 1 número
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

export const userCreateSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(
      strongPasswordRegex,
      'Senha deve conter pelo menos 1 letra maiúscula, 1 minúscula e 1 número'
    ),
  role: z.enum(['ADMIN', 'EDITOR', 'REVIEWER']).optional(),
})

export const userUpdateSchema = z.object({
  email: z.string().email('Email inválido').optional(),
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .optional(),
  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(
      strongPasswordRegex,
      'Senha deve conter pelo menos 1 letra maiúscula, 1 minúscula e 1 número'
    )
    .optional(),
  role: z.enum(['ADMIN', 'EDITOR', 'REVIEWER']).optional(),
  active: z.boolean().optional(),
})

export type UserCreateInput = z.infer<typeof userCreateSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>

// ============================================
// CONTATO
// ============================================

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().max(20, 'Telefone deve ter no máximo 20 caracteres').optional().nullable(),
  subject: z
    .string()
    .min(5, 'Assunto deve ter pelo menos 5 caracteres')
    .max(200, 'Assunto deve ter no máximo 200 caracteres'),
  message: z
    .string()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(5000, 'Mensagem deve ter no máximo 5000 caracteres'),
})

export type ContactInput = z.infer<typeof contactSchema>

// ============================================
// CONFIGURAÇÕES DO SITE
// ============================================

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  logo: z.string().url().optional().nullable(),
  favicon: z.string().url().optional().nullable(),
  socialLinks: z
    .object({
      facebook: z.string().url().optional().nullable(),
      instagram: z.string().url().optional().nullable(),
      youtube: z.string().url().optional().nullable(),
      twitter: z.string().url().optional().nullable(),
    })
    .optional()
    .nullable(),
  contactEmail: z.string().email().optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
})

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>

// ============================================
// QUERY PARAMS
// ============================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
})

export const postsQuerySchema = paginationSchema.extend({
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']).optional(),
  category: z.string().optional(),
  search: z.string().optional(),
})

export const documentsQuerySchema = paginationSchema.extend({
  type: z.enum(['ATA', 'RESOLUCAO', 'EDITAL', 'PARECER', 'RELATORIO', 'PLANILHA', 'OUTRO']).optional(),
  year: z.coerce.number().int().optional(),
  search: z.string().optional(),
})

export const eventsQuerySchema = paginationSchema.extend({
  published: z.coerce.boolean().optional(),
  upcoming: z.coerce.boolean().optional(),
})
