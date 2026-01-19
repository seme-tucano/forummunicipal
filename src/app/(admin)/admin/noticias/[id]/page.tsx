'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  Eye,
  Send,
  Trash2,
  ImagePlus,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Heading2
} from 'lucide-react'
import { AdminHeader } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// Mock data
const mockPost = {
  id: '1',
  title: 'Fórum aprova novas diretrizes para o Plano Municipal de Educação',
  slug: 'forum-aprova-novas-diretrizes-pme',
  excerpt: 'Em reunião extraordinária realizada nesta semana, foram definidas as metas prioritárias para os próximos dois anos com foco na educação infantil e inclusão.',
  content: '<p>O Fórum Municipal da Educação realizou nesta quinta-feira (15) uma reunião extraordinária para discutir e aprovar as novas diretrizes do Plano Municipal de Educação (PME) para o biênio 2026-2028.</p>',
  coverImage: null,
  status: 'PUBLISHED',
  category: 'institucional',
  tags: ['PME', 'Diretrizes'],
}

export default function EditNoticiaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const isNew = id === 'nova'

  const [formData, setFormData] = useState({
    title: isNew ? '' : mockPost.title,
    slug: isNew ? '' : mockPost.slug,
    excerpt: isNew ? '' : mockPost.excerpt,
    content: isNew ? '' : mockPost.content,
    category: isNew ? '' : mockPost.category,
    tags: isNew ? '' : mockPost.tags.join(', '),
    status: isNew ? 'DRAFT' : mockPost.status,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug from title
    if (name === 'title' && isNew) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim()
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleSave = (status?: string) => {
    console.log('Saving:', { ...formData, status: status || formData.status })
    // API call would go here
  }

  return (
    <>
      <AdminHeader
        title={isNew ? 'Nova Notícia' : 'Editar Notícia'}
        description={isNew ? 'Crie uma nova publicação' : `Editando: ${mockPost.title.substring(0, 50)}...`}
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
                {/* Toolbar */}
                <div className="flex flex-wrap gap-1 p-2 border rounded-t-md bg-gray-50">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-8 mx-1" />
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Heading2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-8 mx-1" />
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Quote className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ImagePlus className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Escreva o conteúdo da notícia..."
                  rows={15}
                  className="rounded-t-none border-t-0 font-mono text-sm"
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
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar rascunho
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleSave('REVIEW')}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar para revisão
                </Button>
                <Button
                  className="w-full justify-start"
                  onClick={() => handleSave('PUBLISHED')}
                >
                  <Eye className="h-4 w-4 mr-2" />
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

            {/* Category & Tags */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Organização</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Selecione...</option>
                    <option value="institucional">Institucional</option>
                    <option value="eventos">Eventos</option>
                    <option value="documentos">Documentos</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="PME, Educação, Conferência"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separe as tags por vírgula
                  </p>
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
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
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
