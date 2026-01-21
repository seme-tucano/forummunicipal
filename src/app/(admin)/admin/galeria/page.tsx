'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Search,
  Upload,
  Images,
  ImagePlus,
  Pencil,
  Trash2,
  Eye,
  FolderPlus,
  Loader2,
  X
} from 'lucide-react'
import { AdminHeader } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Album {
  id: string
  name: string
  slug: string
  description: string | null
  coverImage: string | null
  imagesCount: number
  createdAt: string
  images: { id: string; imageUrl: string; thumbnailUrl: string | null }[]
}

export default function GaleriaAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null)
  const [selectedAlbumId, setSelectedAlbumId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<{
    url: string
    fileName: string
    fileSize: number
  }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    fetchAlbums()
  }, [])

  async function fetchAlbums() {
    try {
      const res = await fetch('/api/albums?limit=50')
      const data = await res.json()
      if (data.success) {
        setAlbums(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar álbuns:', error)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setFormData({ name: '', description: '' })
    setEditingAlbum(null)
    setUploadedImages([])
    setSelectedAlbumId('')
  }

  function openCreateModal() {
    resetForm()
    setShowCreateAlbumModal(true)
  }

  function openEditModal(album: Album) {
    setFormData({
      name: album.name,
      description: album.description || '',
    })
    setEditingAlbum(album)
    setShowCreateAlbumModal(true)
  }

  async function handleSaveAlbum() {
    setSaving(true)

    const slug = formData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    const payload = {
      name: formData.name,
      slug: editingAlbum ? editingAlbum.slug : slug,
      description: formData.description || null,
    }

    try {
      const url = editingAlbum ? `/api/albums/${editingAlbum.id}` : '/api/albums'
      const method = editingAlbum ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        setShowCreateAlbumModal(false)
        resetForm()
        fetchAlbums()
      } else {
        alert(data.error || 'Erro ao salvar')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar álbum')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este álbum e todas as suas fotos?')) return

    try {
      const res = await fetch(`/api/albums/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setAlbums(albums.filter(a => a.id !== id))
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
    }
  }

  async function handleFilesSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const formDataUpload = new FormData()

    Array.from(files).forEach(file => {
      formDataUpload.append('files', file)
    })

    try {
      const res = await fetch('/api/upload?type=images', {
        method: 'PUT',
        body: formDataUpload,
      })
      const data = await res.json()

      if (data.success || data.data?.length > 0) {
        setUploadedImages(prev => [...prev, ...data.data])
      } else {
        alert(data.error || 'Erro no upload')
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload das imagens')
    } finally {
      setUploading(false)
    }
  }

  async function handleSaveImages() {
    if (!selectedAlbumId || uploadedImages.length === 0) {
      alert('Selecione um álbum e envie pelo menos uma imagem')
      return
    }

    setSaving(true)

    try {
      const res = await fetch(`/api/albums/${selectedAlbumId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: uploadedImages.map(img => ({
            imageUrl: img.url,
            title: img.fileName,
          })),
        }),
      })

      const data = await res.json()

      if (data.success) {
        setShowUploadModal(false)
        resetForm()
        fetchAlbums()
      } else {
        alert(data.error || 'Erro ao salvar imagens')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar imagens')
    } finally {
      setSaving(false)
    }
  }

  const filteredAlbums = albums.filter(album =>
    album.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalImages = albums.reduce((acc, album) => acc + album.imagesCount, 0)

  return (
    <>
      <AdminHeader
        title="Galeria"
        description="Gerencie álbuns e fotos"
      />

      <div className="p-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar álbuns..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={openCreateModal}>
              <FolderPlus className="h-4 w-4 mr-2" />
              Novo Álbum
            </Button>
            <Button onClick={() => { resetForm(); setShowUploadModal(true); }}>
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{albums.length}</div>
              <div className="text-sm text-gray-500">Álbuns</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">{totalImages}</div>
              <div className="text-sm text-gray-500">Fotos</div>
            </CardContent>
          </Card>
          <Card className="col-span-2 md:col-span-1">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">-</div>
              <div className="text-sm text-gray-500">Armazenamento</div>
            </CardContent>
          </Card>
        </div>

        {/* Create/Edit Album Modal */}
        {showCreateAlbumModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-md my-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {editingAlbum ? 'Editar Álbum' : 'Novo Álbum'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do álbum *
                    </label>
                    <Input
                      placeholder="Ex: Conferência Municipal 2026"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <Textarea
                      placeholder="Descrição breve (opcional)"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => { setShowCreateAlbumModal(false); resetForm(); }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveAlbum} disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {editingAlbum ? 'Salvar' : 'Criar Álbum'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-lg my-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upload de Fotos</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Álbum de destino *
                  </label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedAlbumId}
                    onChange={(e) => setSelectedAlbumId(e.target.value)}
                  >
                    <option value="">Selecione um álbum...</option>
                    {albums.map((album) => (
                      <option key={album.id} value={album.id}>{album.name}</option>
                    ))}
                  </select>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFilesSelect}
                />

                {uploadedImages.length > 0 ? (
                  <div className="mb-4">
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {uploadedImages.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                          <button
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                            onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ImagePlus className="h-4 w-4 mr-2" />}
                      Adicionar mais fotos
                    </Button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 cursor-pointer transition-colors mb-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-10 w-10 mx-auto text-primary-600 mb-2 animate-spin" />
                        <p className="text-gray-600">Enviando fotos...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-600">
                          Clique para selecionar fotos
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          PNG, JPG, WEBP (até 10MB por arquivo)
                        </p>
                      </>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => { setShowUploadModal(false); resetForm(); }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveImages} disabled={saving || uploadedImages.length === 0 || !selectedAlbumId}>
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Adicionar ao Álbum
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Albums Grid */}
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600" />
            <p className="text-gray-500 mt-2">Carregando álbuns...</p>
          </div>
        ) : filteredAlbums.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nenhum álbum encontrado
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredAlbums.map((album) => (
              <Card key={album.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-200 relative">
                  {album.coverImage || album.images[0]?.imageUrl ? (
                    <img
                      src={album.coverImage || album.images[0]?.imageUrl}
                      alt={album.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Images className="h-12 w-12 text-primary-400" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2">
                    <Badge className="bg-black/60 text-white border-0">
                      {album.imagesCount} fotos
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="font-medium text-gray-900 truncate">{album.name}</p>
                  <p className="text-sm text-gray-500">{new Date(album.createdAt).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}</p>
                  <div className="flex items-center gap-1 mt-3">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button variant="ghost" size="icon" className="shrink-0" onClick={() => openEditModal(album)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(album.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
