import Link from 'next/link'
import {
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  File,
  FileSpreadsheet,
  FileImage
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatFileSize } from '@/lib/utils'

const documentTypes = [
  { id: 'todos', name: 'Todos', count: 45 },
  { id: 'ata', name: 'Atas', count: 18 },
  { id: 'resolucao', name: 'Resoluções', count: 12 },
  { id: 'edital', name: 'Editais', count: 5 },
  { id: 'parecer', name: 'Pareceres', count: 6 },
  { id: 'relatorio', name: 'Relatórios', count: 4 },
]

const years = ['2026', '2025', '2024', '2023', '2022']

const documents = [
  {
    id: '1',
    title: 'Ata da Reunião Ordinária - Janeiro/2026',
    description: 'Registro da reunião ordinária do Fórum Municipal da Educação realizada em 15 de janeiro de 2026.',
    type: 'ATA',
    year: 2026,
    fileName: 'ata-reuniao-janeiro-2026.pdf',
    fileSize: 245760,
    mimeType: 'application/pdf',
    createdAt: '15 Jan 2026',
  },
  {
    id: '2',
    title: 'Resolução nº 01/2026 - Diretrizes do PME',
    description: 'Estabelece as novas diretrizes para o Plano Municipal de Educação no biênio 2026-2028.',
    type: 'RESOLUCAO',
    year: 2026,
    fileName: 'resolucao-01-2026-diretrizes-pme.pdf',
    fileSize: 512000,
    mimeType: 'application/pdf',
    createdAt: '16 Jan 2026',
  },
  {
    id: '3',
    title: 'Relatório de Acompanhamento do PME - 2025',
    description: 'Documento com análise detalhada do cumprimento das metas do PME ao longo do ano de 2025.',
    type: 'RELATORIO',
    year: 2025,
    fileName: 'relatorio-pme-2025.pdf',
    fileSize: 1536000,
    mimeType: 'application/pdf',
    createdAt: '10 Jan 2026',
  },
  {
    id: '4',
    title: 'Edital de Convocação - Conferência Municipal 2026',
    description: 'Convocação para a Conferência Municipal de Educação de 2026 com informações sobre inscrição e participação.',
    type: 'EDITAL',
    year: 2026,
    fileName: 'edital-conferencia-2026.pdf',
    fileSize: 189440,
    mimeType: 'application/pdf',
    createdAt: '08 Jan 2026',
  },
  {
    id: '5',
    title: 'Parecer nº 05/2025 - Educação Inclusiva',
    description: 'Parecer técnico sobre políticas de educação inclusiva nas escolas municipais.',
    type: 'PARECER',
    year: 2025,
    fileName: 'parecer-05-2025-educacao-inclusiva.pdf',
    fileSize: 307200,
    mimeType: 'application/pdf',
    createdAt: '20 Dez 2025',
  },
  {
    id: '6',
    title: 'Ata da Reunião Extraordinária - Dezembro/2025',
    description: 'Registro da reunião extraordinária para aprovação do calendário de atividades 2026.',
    type: 'ATA',
    year: 2025,
    fileName: 'ata-reuniao-extraordinaria-dez-2025.pdf',
    fileSize: 204800,
    mimeType: 'application/pdf',
    createdAt: '18 Dez 2025',
  },
]

function getTypeIcon(type: string) {
  switch (type) {
    case 'PLANILHA':
      return FileSpreadsheet
    case 'OUTRO':
      return File
    default:
      return FileText
  }
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

const typeLabels: Record<string, string> = {
  ATA: 'Ata',
  RESOLUCAO: 'Resolução',
  EDITAL: 'Edital',
  PARECER: 'Parecer',
  RELATORIO: 'Relatório',
  PLANILHA: 'Planilha',
  OUTRO: 'Outro',
}

export const metadata = {
  title: 'Documentos',
  description: 'Acesse atas, resoluções, pareceres e demais documentos oficiais do Fórum Municipal da Educação.',
}

export default function DocumentosPage() {
  return (
    <>
      {/* Header */}
      <section className="gradient-hero text-white py-16 md:py-20">
        <div className="container-custom">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            Biblioteca
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Documentos</h1>
          <p className="text-lg text-primary-100 max-w-2xl">
            Acesse atas de reuniões, resoluções, pareceres, editais e demais documentos oficiais do Fórum Municipal da Educação.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="lg:flex lg:gap-8">
            {/* Sidebar */}
            <aside className="lg:w-72 shrink-0 mb-8 lg:mb-0">
              {/* Search */}
              <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar documentos..."
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Document Types */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Tipo de Documento
                </h3>
                <ul className="space-y-2">
                  {documentTypes.map((type) => (
                    <li key={type.id}>
                      <Link
                        href={`/documentos?tipo=${type.id}`}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        <span>{type.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {type.count}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Years */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Ano
                </h3>
                <ul className="space-y-2">
                  {years.map((year) => (
                    <li key={year}>
                      <Link
                        href={`/documentos?ano=${year}`}
                        className="block px-3 py-2 rounded-lg text-sm hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        {year}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Documents List */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Exibindo <strong>{documents.length}</strong> documentos
                </p>
              </div>

              <div className="space-y-4">
                {documents.map((doc) => {
                  const Icon = getTypeIcon(doc.type)
                  return (
                    <Card key={doc.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <div className="flex">
                          <div className={`w-2 ${getTypeColor(doc.type).split(' ')[0]}`} />
                          <div className="flex-1 p-6">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Badge className={getTypeColor(doc.type)}>
                                    {typeLabels[doc.type]}
                                  </Badge>
                                  <span className="text-sm text-gray-500">{doc.createdAt}</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">
                                  {doc.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                  {doc.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Icon className="h-3.5 w-3.5" />
                                    {doc.fileName}
                                  </span>
                                  <span>{formatFileSize(doc.fileSize)}</span>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" className="shrink-0 gap-2">
                                <Download className="h-4 w-4" />
                                Baixar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Pagination */}
              <div className="mt-10 flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="default" size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">
                  Próxima
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
