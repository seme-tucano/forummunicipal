'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Send,
  Loader2,
  Trash2,
  User,
} from 'lucide-react'
import { AdminHeader } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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

export default function MensagemDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const [message, setMessage] = useState<Message | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const [replySubject, setReplySubject] = useState('')
  const [replyMessage, setReplyMessage] = useState('')

  useEffect(() => {
    fetchMessage()
  }, [id])

  async function fetchMessage() {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        credentials: 'include',
      })
      const data = await res.json()

      if (data.success) {
        setMessage(data.data)
        setReplySubject(`Re: ${data.data.subject}`)
      } else {
        setFeedback({ type: 'error', text: data.error })
      }
    } catch (error) {
      console.error('Erro ao buscar mensagem:', error)
      setFeedback({ type: 'error', text: 'Erro ao carregar mensagem' })
    } finally {
      setLoading(false)
    }
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault()

    if (!replyMessage.trim()) {
      setFeedback({ type: 'error', text: 'Digite uma mensagem' })
      return
    }

    setSending(true)
    setFeedback(null)

    try {
      const res = await fetch(`/api/messages/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          subject: replySubject,
          message: replyMessage,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setFeedback({ type: 'success', text: data.message })
        setReplyMessage('')
      } else {
        setFeedback({ type: 'error', text: data.error })
      }
    } catch (error) {
      console.error('Erro ao enviar resposta:', error)
      setFeedback({ type: 'error', text: 'Erro ao enviar resposta' })
    } finally {
      setSending(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json()

      if (data.success) {
        router.push('/admin/mensagens')
      } else {
        setFeedback({ type: 'error', text: data.error })
      }
    } catch (error) {
      console.error('Erro ao excluir mensagem:', error)
      setFeedback({ type: 'error', text: 'Erro ao excluir mensagem' })
    } finally {
      setDeleting(false)
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!message) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">Mensagem nao encontrada</p>
            <Link href="/admin/mensagens">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <AdminHeader
        title="Detalhes da Mensagem"
        description="Visualize e responda a mensagem"
        actions={
          <div className="flex gap-2">
            <Link href="/admin/mensagens">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Excluir
            </Button>
          </div>
        }
      />

      <div className="p-6">
        <div className="max-w-4xl space-y-6">
          {/* Feedback */}
          {feedback && (
            <div
              className={`p-4 rounded-lg ${
                feedback.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {feedback.text}
            </div>
          )}

          {/* Informacoes da mensagem */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{message.subject}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(message.createdAt)}
                    </span>
                    {message.read && (
                      <Badge variant="secondary">Lida</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Dados do remetente */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{message.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a
                    href={`mailto:${message.email}`}
                    className="text-primary-600 hover:underline"
                  >
                    {message.email}
                  </a>
                </div>
                {message.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a
                      href={`tel:${message.phone}`}
                      className="text-primary-600 hover:underline"
                    >
                      {message.phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Mensagem */}
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">{message.message}</p>
              </div>
            </CardContent>
          </Card>

          {/* Formulario de resposta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Responder por E-mail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReply} className="space-y-4">
                <div>
                  <label
                    htmlFor="replySubject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Assunto
                  </label>
                  <Input
                    id="replySubject"
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    placeholder="Assunto do e-mail"
                  />
                </div>

                <div>
                  <label
                    htmlFor="replyMessage"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Mensagem
                  </label>
                  <Textarea
                    id="replyMessage"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Digite sua resposta..."
                    rows={6}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={sending}>
                    {sending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Enviar Resposta
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
