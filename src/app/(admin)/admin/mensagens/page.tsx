'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Mail,
  MailOpen,
  Search,
  Trash2,
  Eye,
  Loader2,
  Inbox,
  Filter,
} from 'lucide-react'
import { AdminHeader } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface Message {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  read: boolean
  createdAt: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function MensagensPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [filter])

  async function fetchMessages(page = 1) {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
      })

      if (filter !== 'all') {
        params.set('status', filter)
      }

      if (search) {
        params.set('search', search)
      }

      const res = await fetch(`/api/messages?${params}`, {
        credentials: 'include',
      })
      const data = await res.json()

      if (data.success) {
        setMessages(data.data)
        setPagination(data.pagination)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json()

      if (data.success) {
        setMessages(messages.filter((m) => m.id !== id))
      }
    } catch (error) {
      console.error('Erro ao excluir mensagem:', error)
    } finally {
      setDeleting(null)
    }
  }

  async function toggleRead(id: string, currentRead: boolean) {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ read: !currentRead }),
      })
      const data = await res.json()

      if (data.success) {
        setMessages(
          messages.map((m) =>
            m.id === id ? { ...m, read: !currentRead } : m
          )
        )
        setUnreadCount((prev) => (currentRead ? prev + 1 : prev - 1))
      }
    } catch (error) {
      console.error('Erro ao atualizar mensagem:', error)
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    fetchMessages()
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    if (diffHours < 24) {
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } else if (diffHours < 48) {
      return 'Ontem'
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      })
    }
  }

  return (
    <>
      <AdminHeader
        title="Mensagens"
        description="Gerencie as mensagens recebidas pelo formulário de contato"
      />

      <div className="p-6">
        {/* Filtros e busca */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, email ou assunto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="outline">
              Buscar
            </Button>
          </form>

          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              <Filter className="h-4 w-4 mr-1" />
              Todas
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              <Mail className="h-4 w-4 mr-1" />
              Nao lidas ({unreadCount})
            </Button>
            <Button
              variant={filter === 'read' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('read')}
            >
              <MailOpen className="h-4 w-4 mr-1" />
              Lidas
            </Button>
          </div>
        </div>

        {/* Lista de mensagens */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : messages.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Inbox className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500">Nenhuma mensagem encontrada</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {messages.map((message) => (
              <Card
                key={message.id}
                className={`transition-colors ${
                  !message.read ? 'bg-primary-50 border-primary-200' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icone de status */}
                    <button
                      onClick={() => toggleRead(message.id, message.read)}
                      className="mt-1 text-gray-400 hover:text-primary-600 transition-colors"
                      title={message.read ? 'Marcar como nao lida' : 'Marcar como lida'}
                    >
                      {message.read ? (
                        <MailOpen className="h-5 w-5" />
                      ) : (
                        <Mail className="h-5 w-5 text-primary-600" />
                      )}
                    </button>

                    {/* Conteudo */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`font-medium ${
                            !message.read ? 'text-gray-900' : 'text-gray-600'
                          }`}
                        >
                          {message.name}
                        </span>
                        <span className="text-gray-400 text-sm">
                          &lt;{message.email}&gt;
                        </span>
                        {!message.read && (
                          <Badge variant="default" className="text-xs">
                            Nova
                          </Badge>
                        )}
                      </div>

                      <p
                        className={`text-sm mb-1 ${
                          !message.read ? 'font-medium text-gray-900' : 'text-gray-700'
                        }`}
                      >
                        {message.subject}
                      </p>

                      <p className="text-sm text-gray-500 truncate">
                        {message.message}
                      </p>
                    </div>

                    {/* Data e acoes */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-400">
                        {formatDate(message.createdAt)}
                      </span>

                      <Link href={`/admin/mensagens/${message.id}`}>
                        <Button variant="ghost" size="icon" title="Ver mensagem">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(message.id)}
                        disabled={deleting === message.id}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Excluir"
                      >
                        {deleting === message.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Paginacao */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => fetchMessages(pagination.page - 1)}
            >
              Anterior
            </Button>
            <span className="flex items-center px-4 text-sm text-gray-500">
              Pagina {pagination.page} de {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => fetchMessages(pagination.page + 1)}
            >
              Proxima
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
