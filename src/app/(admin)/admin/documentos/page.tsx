'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Search,
  Download,
  Pencil,
  Trash2,
  FileText,
  Upload,
  Loader2,
  X
} from 'lucide-react'
import { AdminHeader } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatFileSize, formatDate } from '@/lib/utils'

interface Document {
  id: string
  title: string
  description: string | null
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  type: string
  year: number
  downloads: number
  createdAt: string
  uploadedBy: { id: string; name: string }
  category: { id: string; name: string; slug: string } | null
}

const typeLabels: Record<string, string> = {
  ATA: 'Ata',
  RESOLUCAO: 'Resolução',
  EDITAL: 'Edital',
  PARECER: 'Parecer',
  RELATORIO: 'Relatório',
  PLANILHA: 'Planilha',
  OUTRO: 'Outro',
}

function getTypeColor(type: string) {
  switch (type) {
    case 'ATA':
      return 'bg-blue-100 text-blue-700'
    case 'RESOLUCAO':
      return 'bg-emerald-100 text-emerald-700'
    case 'EDITAL':
      return 'bg-amber-100 text-amber-700'
    case 'PARECER':
      return 'bg-purple-100 text-purple-700'
    case 'RELATORIO':
      return 'bg-rose-100 text-rose-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default function DocumentosAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingDoc, setEditingDoc] = useState<Document | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{
    url: string
    fileName: string
    fileSize: number
    mimeType: string
    originalName: string
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'ATA',
    year: new Date().getFullYear(),
  })

  useEffect(() => {
    fetchDocuments()
  }, [])

  async function fetchDocuments() {
    try {
      const res = await fetch('/api/documents?limit=50')
      const data = await res.json()
      if (data.success) {
        setDocuments(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar documentos:', error)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setFormData({
      title: '',
      description: '',
      type: 'ATA',
      year: new Date().getFullYear(),
    })
    setUploadedFile(null)
    setEditingDoc(null)
  }

  function openUploadModal() {
    resetForm()
    setShowUploadModal(true)
  }

  function openEditModal(doc: Document) {
    setFormData({
      title: doc.title,
      description: doc.description || '',
      type: doc.type,
      year: doc.year,
    })
    setEditingDoc(doc)
    setShowEditModal(true)
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)

    try {
      const res = await fetch('/api/upload?type=documents', {
        method: 'POST',
        body: formDataUpload,
      })
      const data = await res.json()

      if (data.success) {
        setUploadedFile(data.data)
        if (!formData.title) {
          setFormData(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, '') }))
        }
      } else {
        alert(data.error || 'Erro no upload')
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload do arquivo')
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!uploadedFile) {
      alert('Por favor, envie um arquivo')
      return
    }

    setSaving(true)

    const payload = {
      title: formData.title,
      description: formData.description || null,
      fileName: uploadedFile.fileName,
      fileUrl: uploadedFile.url,
      fileSize: uploadedFile.fileSize,
      mimeType: uploadedFile.mimeType,
      type: formData.type,
      year: formData.year,
    }

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        setShowUploadModal(false)
        resetForm()
        fetchDocuments()
      } else {
        alert(data.error || 'Erro ao salvar')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar documento')
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate() {
    if (!editingDoc) return

    setSaving(true)

    try {
      const res = await fetch(`/api/documents/${editingDoc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          type: formData.type,
          year: formData.year,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setShowEditModal(false)
        resetForm()
        fetchDocuments()
      } else {
        alert(data.error || 'Erro ao atualizar')
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      alert('Erro ao atualizar documento')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este documento?')) return

    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setDocuments(documents.filter(d => d.id !== id))
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
    }
  }

  function handleDownload(doc: Document) {
    fetch(`/api/documents/${doc.id}?download=true`)
    window.open(doc.fileUrl, '_blank')
  }

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: documents.length,
    atas: documents.filter(d => d.type === 'ATA').length,
    resolucoes: documents.filter(d => d.type === 'RESOLUCAO').length,
    editais: documents.filter(d => d.type === 'EDITAL').length,
  }

  return (
    <>
      <AdminHeader
        title="Documentos"
        description="Gerencie os documentos do portal"
      />

      <div className="p-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar documentos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={openUploadModal}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.atas}</div>
              <div className="text-sm text-gray-500">Atas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.resolucoes}</div>
              <div className="text-sm text-gray-500">Resoluções</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{stats.editais}</div>
              <div className="text-sm text-gray-500">Editais</div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-lg my-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upload de Documento</h2>

                {/* Drop Zone / File Preview */}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                  onChange={handleFileSelect}
                />

                {uploadedFile ? (
                  <div className="border rounded-lg p-4 mb-4 bg-green-50 border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800">{uploadedFile.originalName}</p>
                          <p className="text-sm text-green-600">{formatFileSize(uploadedFile.fileSize)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setUploadedFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed rounded-lg p-8 text-center mb-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-10 w-10 mx-auto text-primary-600 mb-2 animate-spin" />
                        <p className="text-gray-600">Enviando arquivo...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-600">
                          Clique para selecionar um arquivo
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          PDF, DOC, DOCX, XLS, XLSX (até 50MB)
                        </p>
                      </>
                    )}
                  </div>
                )}

                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título *
                    </label>
                    <Input
                      placeholder="Título do documento"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo *
                      </label>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        <option value="ATA">Ata</option>
                        <option value="RESOLUCAO">Resolução</option>
                        <option value="EDITAL">Edital</option>
                        <option value="PARECER">Parecer</option>
                        <option value="RELATORIO">Relatório</option>
                        <option value="PLANILHA">Planilha</option>
                        <option value="OUTRO">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ano
                      </label>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      >
                        <option value={2026}>2026</option>
                        <option value={2025}>2025</option>
                        <option value={2024}>2024</option>
                        <option value={2023}>2023</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <Textarea
                      placeholder="Descrição breve (opcional)"
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => { setShowUploadModal(false); resetForm(); }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} disabled={saving || !uploadedFile}>
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Enviar Documento
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingDoc && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-lg my-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Editar Documento</h2>

                <div className="border rounded-lg p-4 mb-4 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-800">{editingDoc.fileName}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(editingDoc.fileSize)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título *
                    </label>
                    <Input
                      placeholder="Título do documento"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo *
                      </label>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        <option value="ATA">Ata</option>
                        <option value="RESOLUCAO">Resolução</option>
                        <option value="EDITAL">Edital</option>
                        <option value="PARECER">Parecer</option>
                        <option value="RELATORIO">Relatório</option>
                        <option value="PLANILHA">Planilha</option>
                        <option value="OUTRO">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ano
                      </label>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      >
                        <option value={2026}>2026</option>
                        <option value={2025}>2025</option>
                        <option value={2024}>2024</option>
                        <option value={2023}>2023</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <Textarea
                      placeholder="Descrição breve (opcional)"
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => { setShowEditModal(false); resetForm(); }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdate} disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Table */}
        <Card>
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600" />
              <p className="text-gray-500 mt-2">Carregando documentos...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-medium text-gray-600">Documento</th>
                      <th className="text-left p-4 font-medium text-gray-600">Tipo</th>
                      <th className="text-left p-4 font-medium text-gray-600 hidden md:table-cell">Tamanho</th>
                      <th className="text-left p-4 font-medium text-gray-600 hidden lg:table-cell">Downloads</th>
                      <th className="text-left p-4 font-medium text-gray-600 hidden sm:table-cell">Data</th>
                      <th className="text-right p-4 font-medium text-gray-600">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500">
                          Nenhum documento encontrado
                        </td>
                      </tr>
                    ) : (
                      filteredDocuments.map((doc) => (
                        <tr key={doc.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-gray-500" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{doc.title}</p>
                                <p className="text-sm text-gray-500">{doc.fileName}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={getTypeColor(doc.type)}>
                              {typeLabels[doc.type] || doc.type}
                            </Badge>
                          </td>
                          <td className="p-4 hidden md:table-cell text-gray-600">
                            {formatFileSize(doc.fileSize)}
                          </td>
                          <td className="p-4 hidden lg:table-cell">
                            <span className="flex items-center gap-1 text-gray-600">
                              <Download className="h-3.5 w-3.5" />
                              {doc.downloads}
                            </span>
                          </td>
                          <td className="p-4 hidden sm:table-cell text-gray-600">
                            {formatDate(doc.createdAt)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Download"
                                onClick={() => handleDownload(doc)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Editar"
                                onClick={() => openEditModal(doc)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Excluir"
                                onClick={() => handleDelete(doc.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Mostrando {filteredDocuments.length} de {stats.total} documentos
                </p>
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  )
}
