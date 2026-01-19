'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  Filter,
  Download,
  Pencil,
  Trash2,
  FileText,
  Upload
} from 'lucide-react'
import { AdminHeader } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatFileSize } from '@/lib/utils'

const documents = [
  {
    id: '1',
    title: 'Ata da Reunião Ordinária - Janeiro/2026',
    type: 'ATA',
    year: 2026,
    fileName: 'ata-reuniao-janeiro-2026.pdf',
    fileSize: 245760,
    downloads: 45,
    uploadedBy: 'Maria Silva',
    date: '15 Jan 2026',
  },
  {
    id: '2',
    title: 'Resolução nº 01/2026 - Diretrizes do PME',
    type: 'RESOLUCAO',
    year: 2026,
    fileName: 'resolucao-01-2026.pdf',
    fileSize: 512000,
    downloads: 32,
    uploadedBy: 'João Santos',
    date: '16 Jan 2026',
  },
  {
    id: '3',
    title: 'Relatório de Acompanhamento do PME - 2025',
    type: 'RELATORIO',
    year: 2025,
    fileName: 'relatorio-pme-2025.pdf',
    fileSize: 1536000,
    downloads: 89,
    uploadedBy: 'Maria Silva',
    date: '10 Jan 2026',
  },
  {
    id: '4',
    title: 'Edital de Convocação - Conferência Municipal 2026',
    type: 'EDITAL',
    year: 2026,
    fileName: 'edital-conferencia-2026.pdf',
    fileSize: 189440,
    downloads: 67,
    uploadedBy: 'Carlos Oliveira',
    date: '08 Jan 2026',
  },
]

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
  const [showUploadModal, setShowUploadModal] = useState(false)

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
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            <Button onClick={() => setShowUploadModal(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">45</div>
              <div className="text-sm text-gray-500">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">18</div>
              <div className="text-sm text-gray-500">Atas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">12</div>
              <div className="text-sm text-gray-500">Resoluções</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">5</div>
              <div className="text-sm text-gray-500">Editais</div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Modal Placeholder */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upload de Documento</h2>

                {/* Drop Zone */}
                <div className="border-2 border-dashed rounded-lg p-8 text-center mb-4 hover:bg-gray-50 cursor-pointer">
                  <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">
                    Arraste um arquivo ou clique para selecionar
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    PDF, DOC, DOCX, XLS, XLSX (até 50MB)
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título *
                    </label>
                    <Input placeholder="Título do documento" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo *
                      </label>
                      <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="">Selecione...</option>
                        <option value="ATA">Ata</option>
                        <option value="RESOLUCAO">Resolução</option>
                        <option value="EDITAL">Edital</option>
                        <option value="PARECER">Parecer</option>
                        <option value="RELATORIO">Relatório</option>
                        <option value="OUTRO">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ano
                      </label>
                      <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <Input placeholder="Descrição breve (opcional)" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                    Cancelar
                  </Button>
                  <Button>
                    Enviar Documento
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Table */}
        <Card>
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
                {documents.map((doc) => (
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
                        {typeLabels[doc.type]}
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
                      {doc.date}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Mostrando 1-4 de 45 documentos
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm">
                Próxima
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
