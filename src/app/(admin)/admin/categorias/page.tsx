'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  FolderOpen,
  Newspaper,
  FileText,
  Tag,
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
  description: string | null
  postsCount: number
  documentsCount: number
}

interface TagData {
  id: string
  name: string
  slug: string
  postsCount: number
}

export default function CategoriasAdminPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<TagData[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingTags, setLoadingTags] = useState(true)
  const [saving, setSaving] = useState(false)

  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false)
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', description: '' })

  const [showCreateTagModal, setShowCreateTagModal] = useState(false)
  const [tagForm, setTagForm] = useState({ name: '', slug: '' })

  useEffect(() => {
    fetchCategories()
    fetchTags()
  }, [])

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

  async function fetchTags() {
    try {
      const res = await fetch('/api/tags')
      const data = await res.json()
      if (data.success) {
        setTags(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar tags:', error)
    } finally {
      setLoadingTags(false)
    }
  }

  function resetCategoryForm() {
    setCategoryForm({ name: '', slug: '', description: '' })
    setEditingCategory(null)
  }

  function resetTagForm() {
    setTagForm({ name: '', slug: '' })
  }

  function openCreateCategoryModal() {
    resetCategoryForm()
    setShowCreateCategoryModal(true)
  }

  function openEditCategoryModal(category: Category) {
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    })
    setEditingCategory(category)
    setShowEditCategoryModal(true)
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  async function handleCreateCategory() {
    if (!categoryForm.name) {
      alert('Nome é obrigatório')
      return
    }

    setSaving(true)

    const slug = categoryForm.slug || generateSlug(categoryForm.name)

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: categoryForm.name,
          slug,
          description: categoryForm.description || null,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setShowCreateCategoryModal(false)
        resetCategoryForm()
        fetchCategories()
      } else {
        alert(data.error || 'Erro ao criar categoria')
      }
    } catch (error) {
      console.error('Erro ao criar:', error)
      alert('Erro ao criar categoria')
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdateCategory() {
    if (!editingCategory || !categoryForm.name) return

    setSaving(true)

    try {
      const res = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: categoryForm.name,
          slug: categoryForm.slug,
          description: categoryForm.description || null,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setShowEditCategoryModal(false)
        resetCategoryForm()
        fetchCategories()
      } else {
        alert(data.error || 'Erro ao atualizar categoria')
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      alert('Erro ao atualizar categoria')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (res.ok) {
        setCategories(categories.filter(c => c.id !== id))
      } else {
        alert(data.error || 'Erro ao excluir categoria')
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
    }
  }

  async function handleCreateTag() {
    if (!tagForm.name) {
      alert('Nome é obrigatório')
      return
    }

    setSaving(true)

    const slug = tagForm.slug || generateSlug(tagForm.name)

    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tagForm.name,
          slug,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setShowCreateTagModal(false)
        resetTagForm()
        fetchTags()
      } else {
        alert(data.error || 'Erro ao criar tag')
      }
    } catch (error) {
      console.error('Erro ao criar:', error)
      alert('Erro ao criar tag')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteTag(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta tag?')) return

    try {
      const res = await fetch(`/api/tags?id=${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (res.ok) {
        setTags(tags.filter(t => t.id !== id))
      } else {
        alert(data.error || 'Erro ao excluir tag')
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
    }
  }

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
                <Button size="sm" onClick={openCreateCategoryModal}>
                  <Plus className="h-4 w-4 mr-1" />
                  Nova
                </Button>
              </CardHeader>
              <CardContent>
                {loadingCategories ? (
                  <div className="py-8 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary-600" />
                    <p className="text-sm text-gray-500 mt-2">Carregando...</p>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    Nenhuma categoria cadastrada
                  </div>
                ) : (
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-500 truncate">{category.description || 'Sem descrição'}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Newspaper className="h-3 w-3" />
                              {category.postsCount} notícias
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {category.documentsCount} documentos
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditCategoryModal(category)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteCategory(category.id)}
                            disabled={category.postsCount > 0 || category.documentsCount > 0}
                            title={category.postsCount > 0 || category.documentsCount > 0 ? 'Não é possível excluir categoria com itens vinculados' : 'Excluir'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                <Button size="sm" onClick={() => { resetTagForm(); setShowCreateTagModal(true); }}>
                  <Plus className="h-4 w-4 mr-1" />
                  Nova
                </Button>
              </CardHeader>
              <CardContent>
                {loadingTags ? (
                  <div className="py-8 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary-600" />
                    <p className="text-sm text-gray-500 mt-2">Carregando...</p>
                  </div>
                ) : tags.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    Nenhuma tag cadastrada
                  </div>
                ) : (
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
                          {tag.postsCount}
                        </Badge>
                        <button
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600"
                          onClick={() => handleDeleteTag(tag.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-md my-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Nova Categoria</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome *
                    </label>
                    <Input
                      placeholder="Nome da categoria"
                      value={categoryForm.name}
                      onChange={(e) => {
                        setCategoryForm({
                          ...categoryForm,
                          name: e.target.value,
                          slug: generateSlug(e.target.value),
                        })
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug
                    </label>
                    <Input
                      placeholder="url-amigavel"
                      value={categoryForm.slug}
                      onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Gerado automaticamente a partir do nome
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <Textarea
                      placeholder="Descrição breve (opcional)"
                      rows={2}
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => { setShowCreateCategoryModal(false); resetCategoryForm(); }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateCategory} disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Criar Categoria
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Category Modal */}
        {showEditCategoryModal && editingCategory && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-md my-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Editar Categoria</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome *
                    </label>
                    <Input
                      placeholder="Nome da categoria"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug
                    </label>
                    <Input
                      placeholder="url-amigavel"
                      value={categoryForm.slug}
                      onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <Textarea
                      placeholder="Descrição breve (opcional)"
                      rows={2}
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => { setShowEditCategoryModal(false); resetCategoryForm(); }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdateCategory} disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Tag Modal */}
        {showCreateTagModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-md my-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Nova Tag</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome *
                    </label>
                    <Input
                      placeholder="Nome da tag"
                      value={tagForm.name}
                      onChange={(e) => {
                        setTagForm({
                          ...tagForm,
                          name: e.target.value,
                          slug: generateSlug(e.target.value),
                        })
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug
                    </label>
                    <Input
                      placeholder="url-amigavel"
                      value={tagForm.slug}
                      onChange={(e) => setTagForm({ ...tagForm, slug: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => { setShowCreateTagModal(false); resetTagForm(); }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateTag} disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Criar Tag
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  )
}
