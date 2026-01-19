'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  Upload,
  Images,
  ImagePlus,
  Pencil,
  Trash2,
  Eye,
  FolderPlus
} from 'lucide-react'
import { AdminHeader } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const albums = [
  {
    id: '1',
    name: 'Conferência Municipal 2025',
    imageCount: 45,
    date: 'Nov 2025',
  },
  {
    id: '2',
    name: 'Posse dos Conselheiros 2026',
    imageCount: 28,
    date: 'Jan 2026',
  },
  {
    id: '3',
    name: 'Audiência Pública - Educação Infantil',
    imageCount: 32,
    date: 'Dez 2025',
  },
  {
    id: '4',
    name: 'Reuniões Ordinárias 2025',
    imageCount: 64,
    date: '2025',
  },
]

const recentImages = [
  { id: '1', title: 'Foto 1', album: 'Posse dos Conselheiros 2026' },
  { id: '2', title: 'Foto 2', album: 'Posse dos Conselheiros 2026' },
  { id: '3', title: 'Foto 3', album: 'Posse dos Conselheiros 2026' },
  { id: '4', title: 'Foto 4', album: 'Posse dos Conselheiros 2026' },
  { id: '5', title: 'Foto 5', album: 'Conferência Municipal 2025' },
  { id: '6', title: 'Foto 6', album: 'Conferência Municipal 2025' },
]

export default function GaleriaAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)

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
              placeholder="Buscar álbuns ou fotos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCreateAlbumModal(true)}>
              <FolderPlus className="h-4 w-4 mr-2" />
              Novo Álbum
            </Button>
            <Button onClick={() => setShowUploadModal(true)}>
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">6</div>
              <div className="text-sm text-gray-500">Álbuns</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">259</div>
              <div className="text-sm text-gray-500">Fotos</div>
            </CardContent>
          </Card>
          <Card className="col-span-2 md:col-span-1">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">1.2 GB</div>
              <div className="text-sm text-gray-500">Armazenamento</div>
            </CardContent>
          </Card>
        </div>

        {/* Create Album Modal */}
        {showCreateAlbumModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Novo Álbum</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do álbum *
                    </label>
                    <Input placeholder="Ex: Conferência Municipal 2026" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <Input placeholder="Descrição breve (opcional)" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowCreateAlbumModal(false)}>
                    Cancelar
                  </Button>
                  <Button>Criar Álbum</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upload de Fotos</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Álbum de destino *
                  </label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Selecione um álbum...</option>
                    {albums.map((album) => (
                      <option key={album.id} value={album.id}>{album.name}</option>
                    ))}
                  </select>
                </div>

                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 cursor-pointer">
                  <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">
                    Arraste as fotos ou clique para selecionar
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    PNG, JPG, WEBP (até 10MB por arquivo)
                  </p>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                    Cancelar
                  </Button>
                  <Button>Enviar Fotos</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Albums Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Álbuns</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {albums.map((album) => (
              <Card key={album.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Images className="h-12 w-12 text-primary-400" />
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <Badge className="bg-black/60 text-white border-0">
                      {album.imageCount} fotos
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="font-medium text-gray-900 truncate">{album.name}</p>
                  <p className="text-sm text-gray-500">{album.date}</p>
                  <div className="flex items-center gap-1 mt-3">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Images */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Fotos Recentes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentImages.map((image) => (
              <div key={image.id} className="group relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Images className="h-8 w-8 text-gray-400" />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
