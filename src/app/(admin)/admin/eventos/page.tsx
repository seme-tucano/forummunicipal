'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  Clock,
  MapPin,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react'
import { AdminHeader } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

interface Event {
  id: string
  title: string
  slug: string
  description: string
  location: string | null
  startDate: string
  endDate: string | null
  published: boolean
}

export default function EventosAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    published: false,
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      const res = await fetch('/api/events?limit=50')
      const data = await res.json()
      if (data.success) {
        setEvents(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar eventos:', error)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setFormData({
      title: '',
      description: '',
      location: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      published: false,
    })
    setEditingEvent(null)
  }

  function openCreateModal() {
    resetForm()
    setShowCreateModal(true)
  }

  function openEditModal(event: Event) {
    const startDate = new Date(event.startDate)
    const endDate = event.endDate ? new Date(event.endDate) : null

    setFormData({
      title: event.title,
      description: event.description,
      location: event.location || '',
      startDate: startDate.toISOString().split('T')[0],
      startTime: startDate.toTimeString().slice(0, 5),
      endDate: endDate ? endDate.toISOString().split('T')[0] : '',
      endTime: endDate ? endDate.toTimeString().slice(0, 5) : '',
      published: event.published,
    })
    setEditingEvent(event)
    setShowCreateModal(true)
  }

  async function handleSave() {
    setSaving(true)

    const slug = formData.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}:00`)
    const endDateTime = formData.endDate && formData.endTime
      ? new Date(`${formData.endDate}T${formData.endTime}:00`)
      : null

    const payload = {
      title: formData.title,
      slug: editingEvent ? editingEvent.slug : slug,
      description: formData.description,
      location: formData.location || null,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime?.toISOString() || null,
      published: formData.published,
    }

    try {
      const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events'
      const method = editingEvent ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        setShowCreateModal(false)
        resetForm()
        fetchEvents()
      } else {
        alert(data.error || 'Erro ao salvar')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar evento')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return

    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setEvents(events.filter(e => e.id !== id))
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
    }
  }

  async function togglePublish(event: Event) {
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !event.published }),
      })

      if (res.ok) {
        setEvents(events.map(e =>
          e.id === event.id ? { ...e, published: !e.published } : e
        ))
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error)
    }
  }

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const upcomingCount = events.filter(e => new Date(e.startDate) > new Date()).length
  const publishedCount = events.filter(e => e.published).length
  const draftCount = events.filter(e => !e.published).length

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
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{events.length}</div>
              <div className="text-sm text-gray-500">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">{upcomingCount}</div>
              <div className="text-sm text-gray-500">Próximos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
              <div className="text-sm text-gray-500">Publicados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-400">{draftCount}</div>
              <div className="text-sm text-gray-500">Rascunhos</div>
            </CardContent>
          </Card>
        </div>

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-lg my-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {editingEvent ? 'Editar Evento' : 'Novo Evento'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título *
                    </label>
                    <Input
                      placeholder="Nome do evento"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <Textarea
                      placeholder="Descrição do evento"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data *
                      </label>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Horário *
                      </label>
                      <Input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data/Hora de término (opcional)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      />
                      <Input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Local
                    </label>
                    <Input
                      placeholder="Local do evento"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="publish"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    />
                    <label htmlFor="publish" className="text-sm text-gray-700">
                      Publicar imediatamente
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => { setShowCreateModal(false); resetForm(); }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {editingEvent ? 'Salvar' : 'Criar Evento'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Events List */}
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600" />
            <p className="text-gray-500 mt-2">Carregando eventos...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nenhum evento encontrado
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => {
              const isUpcoming = new Date(event.startDate) > new Date()
              const startDate = new Date(event.startDate)

              return (
                <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Date Column */}
                      <div className={`w-24 shrink-0 p-4 flex flex-col items-center justify-center ${
                        isUpcoming ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        <span className="text-2xl font-bold">{startDate.getDate()}</span>
                        <span className="text-sm">{startDate.toLocaleString('pt-BR', { month: 'short' })}</span>
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
                                {startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {event.location}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              title={event.published ? 'Despublicar' : 'Publicar'}
                              onClick={() => togglePublish(event)}
                            >
                              {event.published ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditModal(event)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(event.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
