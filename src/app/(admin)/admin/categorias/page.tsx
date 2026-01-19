'use client'

import { useState } from 'react'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  FolderOpen,
  Newspaper,
  FileText,
  Tag
} from 'lucide-react'
import { AdminHeader } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const categories = [
  {
    id: '1',
    name: 'Institucional',
    slug: 'institucional',
    description: 'Notícias e informações sobre o Fórum',
    postCount: 10,
    documentCount: 8,
  },
  {
    id: '2',
    name: 'Eventos',
    slug: 'eventos',
    description: 'Conferências, audiências e reuniões',
    postCount: 8,
    documentCount: 5,
  },
  {
    id: '3',
    name: 'Documentos',
    slug: 'documentos',
    description: 'Publicações de atas, resoluções e pareceres',
    postCount: 6,
    documentCount: 32,
  },
]

const tags = [
  { id: '1', name: 'PME', slug: 'pme', count: 12 },
  { id: '2', name: 'Educação Infantil', slug: 'educacao-infantil', count: 8 },
  { id: '3', name: 'Conferência', slug: 'conferencia', count: 6 },
  { id: '4', name: 'Inclusão', slug: 'inclusao', count: 5 },
  { id: '5', name: 'Formação', slug: 'formacao', count: 4 },
  { id: '6', name: 'Orçamento', slug: 'orcamento', count: 3 },
]

export default function CategoriasAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false)
  const [showCreateTagModal, setShowCreateTagModal] = useState(false)

  return (
    <>
      <AdminHeader
        title="Categorias e Tags"
        description="Organize o conteúdo do portal"
      />

      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Categories */}
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary-600" />
                  Categorias
                </CardTitle>
                <Button size="sm" onClick={() => setShowCreateCategoryModal(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Nova
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{category.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Newspaper className="h-3 w-3" />
                            {category.postCount} notícias
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {category.documentCount} documentos
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tags */}
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary-600" />
                  Tags
                </CardTitle>
                <Button size="sm" onClick={() => setShowCreateTagModal(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Nova
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="group flex items-center gap-2 px-3 py-2 rounded-full border hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
                        {tag.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {tag.count}
                      </Badge>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="font-medium text-gray-900 mb-3">Sobre Categorias e Tags</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>Categorias</strong> são usadas para organizar notícias e documentos em grandes grupos temáticos.
                    Cada item pode pertencer a apenas uma categoria.
                  </p>
                  <p>
                    <strong>Tags</strong> são palavras-chave que ajudam a encontrar conteúdos relacionados.
                    Um item pode ter várias tags.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Create Category Modal */}
        {showCreateCategoryModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Nova Categoria</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome *
                    </label>
                    <Input placeholder="Nome da categoria" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug
                    </label>
                    <Input placeholder="url-amigavel" />
                    <p className="text-xs text-gray-500 mt-1">
                      Gerado automaticamente a partir do nome
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <Input placeholder="Descrição breve (opcional)" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowCreateCategoryModal(false)}>
                    Cancelar
                  </Button>
                  <Button>Criar Categoria</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Tag Modal */}
        {showCreateTagModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Nova Tag</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome *
                    </label>
                    <Input placeholder="Nome da tag" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug
                    </label>
                    <Input placeholder="url-amigavel" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowCreateTagModal(false)}>
                    Cancelar
                  </Button>
                  <Button>Criar Tag</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  )
}
