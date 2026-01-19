'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  Clock,
  Pencil,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'
import { AdminHeader } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const events = [
  {
    id: '1',
    title: 'Reunião Ordinária do Fórum',
    description: 'Reunião mensal para discussão de pautas e deliberações.',
    date: '22 Jan 2026',
    time: '14:00',
    location: 'Auditório da Secretaria de Educação',
    published: true,
    upcoming: true,
  },
  {
    id: '2',
    title: 'Conferência Municipal de Educação 2026',
    description: 'Grande evento bienal para debate de políticas educacionais.',
    date: '25 Fev 2026',
    time: '08:00',
    location: 'Centro de Convenções Municipal',
    published: true,
    upcoming: true,
  },
  {
    id: '3',
    title: 'Audiência Pública - Orçamento da Educação',
    description: 'Apresentação e discussão da proposta orçamentária.',
    date: '15 Mar 2026',
    time: '09:00',
    location: 'Câmara Municipal',
    published: false,
    upcoming: true,
  },
  {
    id: '4',
    title: 'Posse dos Novos Conselheiros',
    description: 'Cerimônia de posse para o biênio 2026-2028.',
    date: '05 Jan 2026',
    time: '10:00',
    location: 'Auditório da Secretaria de Educação',
    published: true,
    upcoming: false,
  },
]

export default function EventosAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <>
      <AdminHeader
        title="Eventos"
        description="Gerencie a agenda de eventos"
      />

      <div className="p-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar eventos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-500">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">4</div>
              <div className="text-sm text-gray-500">Próximos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-500">Publicados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-400">1</div>
              <div className="text-sm text-gray-500">Rascunhos</div>
            </CardContent>
          </Card>
        </div>

        {/* Create Event Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-lg my-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Novo Evento</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título *
                    </label>
                    <Input placeholder="Nome do evento" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <Textarea placeholder="Descrição do evento" rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data *
                      </label>
                      <Input type="date" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Horário *
                      </label>
                      <Input type="time" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de término (opcional)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input type="date" />
                      <Input type="time" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Local
                    </label>
                    <Input placeholder="Local do evento" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="publish"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600"
                    />
                    <label htmlFor="publish" className="text-sm text-gray-700">
                      Publicar imediatamente
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancelar
                  </Button>
                  <Button>Criar Evento</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Events List */}
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex">
                  {/* Date Column */}
                  <div className={`w-24 shrink-0 p-4 flex flex-col items-center justify-center ${
                    event.upcoming ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    <span className="text-2xl font-bold">{event.date.split(' ')[0]}</span>
                    <span className="text-sm">{event.date.split(' ')[1]}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                          {event.published ? (
                            <Badge className="bg-green-100 text-green-700">Publicado</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-600">Rascunho</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" title={event.published ? 'Despublicar' : 'Publicar'}>
                          {event.published ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
