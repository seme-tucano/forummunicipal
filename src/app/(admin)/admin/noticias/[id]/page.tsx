'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  Eye,
  Send,
  Trash2,
  ImagePlus,
  Loader2
} from 'lucide-react'
import { AdminHeader } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Category {
  id: string
  name: string
  slug: string
}

export default function EditNoticiaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const isNew = id === 'nova'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    categoryId: '',
    status: 'DRAFT',
  })

  useEffect(() => {
    fetchCategories()
    if (!isNew) {
      fetchPost()
    }
  }, [id, isNew])

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories', { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
    }
  }

  async function fetchPost() {
    try {
      const res = await fetch(`/api/posts/${id}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        const post = data.data
        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          content: post.content || '',
          categoryId: post.categoryId || '',
          status: post.status,
        })
      }
    } catch (error) {
      console.error('Erro ao buscar post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug from title for new posts
    if (name === 'title' && isNew) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9\s-]/g, '')    // Remove caracteres especiais (só permite a-z, 0-9, espaço e hífen)
        .replace(/\s+/g, '-')             // Espaços viram hífens
        .replace(/-+/g, '-')              // Múltiplos hífens viram um só
        .replace(/^-|-$/g, '')            // Remove hífens do início e fim
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleSave = async (status?: string) => {
    setSaving(true)
    const finalStatus = status || formData.status

    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        categoryId: formData.categoryId || null,
        status: finalStatus,
        publishedAt: finalStatus === 'PUBLISHED' ? new Date().toISOString() : null,
      }

      const url = isNew ? '/api/posts' : `/api/posts/${id}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        router.push('/admin/noticias')
        router.refresh()
      } else {
        // Mostrar erros detalhados se disponíveis
        if (data.errors) {
          const errorMessages = Object.entries(data.errors)
            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
            .join('\n')
          alert(`Erros de validação:\n${errorMessages}`)
        } else {
          alert(data.error || 'Erro ao salvar')
        }
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar notícia')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta notícia?')) return

    setSaving(true)
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE', credentials: 'include' })
      if (res.ok) {
        router.push('/admin/noticias')
        router.refresh()
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <>
      <AdminHeader
        title={isNew ? 'Nova Notícia' : 'Editar Notícia'}
        description={isNew ? 'Crie uma nova publicação' : `Editando: ${formData.title.substring(0, 50)}...`}
      />

      <div className="p-6">
        <div className="mb-6">
          <Link
            href="/admin/noticias"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para notícias
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Slug */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Digite o título da notícia"
                    className="text-lg"
                  />
                </div>
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                    URL amigável
                  </label>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">/noticias/</span>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      placeholder="url-da-noticia"
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Excerpt */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Resumo</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Breve descrição da notícia (aparece na listagem)"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-2">
                  {formData.excerpt.length}/300 caracteres
                </p>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Conteúdo</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Escreva o conteúdo da notícia (pode usar HTML)..."
                  rows={15}
                  className="font-mono text-sm"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  Publicação
                  {!isNew && (
                    <Badge className={
                      formData.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                      formData.status === 'REVIEW' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }>
                      {formData.status === 'PUBLISHED' ? 'Publicado' :
                       formData.status === 'REVIEW' ? 'Em revisão' : 'Rascunho'}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleSave('DRAFT')}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Salvar rascunho
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleSave('REVIEW')}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Enviar para revisão
                </Button>
                <Button
                  className="w-full justify-start"
                  onClick={() => handleSave('PUBLISHED')}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Eye className="h-4 w-4 mr-2" />}
                  Publicar agora
                </Button>
              </CardContent>
            </Card>

            {/* Cover Image */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Imagem de Capa</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                  <ImagePlus className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Clique para enviar ou arraste uma imagem
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG até 5MB
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Organização</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Selecione...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Delete */}
            {!isNew && (
              <Card className="border-red-200">
                <CardContent className="p-4">
                  <Button
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={handleDelete}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                    Excluir notícia
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
