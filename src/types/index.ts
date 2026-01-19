// Enums
export type Role = 'ADMIN' | 'EDITOR' | 'REVIEWER'
export type PostStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED'
export type DocumentType = 'ATA' | 'RESOLUCAO' | 'EDITAL' | 'PARECER' | 'RELATORIO' | 'PLANILHA' | 'OUTRO'

// User
export interface User {
  id: string
  email: string
  name: string
  role: Role
  active: boolean
  createdAt: Date
  updatedAt: Date
}

// Category
export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  _count?: {
    posts: number
    documents: number
  }
}

// Tag
export interface Tag {
  id: string
  name: string
  slug: string
}

// Post/Notícia
export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string | null
  status: PostStatus
  publishedAt?: Date | null
  createdAt: Date
  updatedAt: Date
  authorId: string
  author?: User
  categoryId?: string | null
  category?: Category | null
  tags?: Tag[]
}

// Document/Arquivo
export interface Document {
  id: string
  title: string
  description?: string | null
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  type: DocumentType
  year?: number | null
  version: number
  createdAt: Date
  updatedAt: Date
  uploadedById: string
  uploadedBy?: User
  categoryId?: string | null
  category?: Category | null
}

// Gallery Image
export interface GalleryImage {
  id: string
  title?: string | null
  description?: string | null
  imageUrl: string
  thumbnailUrl?: string | null
  albumId?: string | null
  album?: Album | null
  order: number
  createdAt: Date
}

// Album
export interface Album {
  id: string
  name: string
  slug: string
  description?: string | null
  coverImage?: string | null
  createdAt: Date
  images?: GalleryImage[]
  _count?: {
    images: number
  }
}

// Event
export interface Event {
  id: string
  title: string
  slug: string
  description: string
  location?: string | null
  startDate: Date
  endDate?: Date | null
  published: boolean
  createdAt: Date
  updatedAt: Date
}

// Site Settings
export interface SiteSettings {
  id: string
  siteName: string
  description?: string | null
  logo?: string | null
  favicon?: string | null
  socialLinks?: {
    facebook?: string
    instagram?: string
    youtube?: string
  } | null
  contactEmail?: string | null
  address?: string | null
  phone?: string | null
  updatedAt: Date
}

// Pagination
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// API Response
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
