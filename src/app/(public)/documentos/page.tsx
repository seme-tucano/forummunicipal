import Link from 'next/link'
import {
  FileText,
  Download,
  Filter,
  Calendar,
  File,
  FileSpreadsheet
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import prisma from '@/lib/prisma'
import { formatFileSize } from '@/lib/utils'

export const metadata = {
  title: 'Documentos',
  description: 'Acesse atas, resoluções, pareceres e demais documentos oficiais do Fórum Municipal da Educação.',
}

async function getDocuments(type?: string, year?: string) {
  const where: Record<string, unknown> = {}

  if (type && type !== 'todos') {
    where.type = type.toUpperCase()
  }

  if (year) {
    where.year = parseInt(year)
  }

  const documents = await prisma.document.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  })
  return documents
}

async function getDocumentStats() {
  const stats = await prisma.document.groupBy({
    by: ['type'],
    _count: {
      type: true,
    },
  })

  const total = await prisma.document.count()

  return { stats, total }
}

async function getYears() {
  const years = await prisma.document.groupBy({
    by: ['year'],
    orderBy: {
      year: 'desc',
    },
  })
  return years.map((y) => y.year)
}

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

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export const revalidate = 60

export default async function DocumentosPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; ano?: string }>
}) {
  const params = await searchParams
  const typeFilter = params.tipo
  const yearFilter = params.ano

  const [documents, { stats, total }, years] = await Promise.all([
    getDocuments(typeFilter, yearFilter),
    getDocumentStats(),
    getYears(),
  ])

  const documentTypes = [
    { id: 'todos', name: 'Todos', count: total },
    ...Object.entries(typeLabels).map(([key, label]) => {
      const stat = stats.find((s) => s.type === key)
      return {
        id: key.toLowerCase(),
        name: label + 's',
        count: stat?._count.type || 0,
      }
    }).filter((t) => t.count > 0),
  ]

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
                        href={type.id === 'todos' ? '/documentos' : `/documentos?tipo=${type.id}`}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-primary-50 hover:text-primary-700 transition-colors ${
                          (type.id === 'todos' && !typeFilter) || typeFilter === type.id
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : ''
                        }`}
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
              {years.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Ano
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href={typeFilter ? `/documentos?tipo=${typeFilter}` : '/documentos'}
                        className={`block px-3 py-2 rounded-lg text-sm hover:bg-primary-50 hover:text-primary-700 transition-colors ${
                          !yearFilter ? 'bg-primary-50 text-primary-700 font-medium' : ''
                        }`}
                      >
                        Todos
                      </Link>
                    </li>
                    {years.map((year) => (
                      <li key={year}>
                        <Link
                          href={`/documentos?${typeFilter ? `tipo=${typeFilter}&` : ''}ano=${year}`}
                          className={`block px-3 py-2 rounded-lg text-sm hover:bg-primary-50 hover:text-primary-700 transition-colors ${
                            yearFilter === String(year) ? 'bg-primary-50 text-primary-700 font-medium' : ''
                          }`}
                        >
                          {year}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>

            {/* Documents List */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Exibindo <strong>{documents.length}</strong> documento{documents.length !== 1 ? 's' : ''}
                </p>
              </div>

              {documents.length > 0 ? (
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
                                    <span className="text-sm text-gray-500">{formatDate(doc.createdAt)}</span>
                                  </div>
                                  <h3 className="font-semibold text-gray-900 mb-2">
                                    {doc.title}
                                  </h3>
                                  {doc.description && (
                                    <p className="text-sm text-gray-600 mb-3">
                                      {doc.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Icon className="h-3.5 w-3.5" />
                                      {doc.fileName}
                                    </span>
                                    <span>{formatFileSize(doc.fileSize)}</span>
                                  </div>
                                </div>
                                <Button asChild variant="outline" size="sm" className="shrink-0 gap-2">
                                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" download>
                                    <Download className="h-4 w-4" />
                                    Baixar
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Nenhum documento encontrado</h3>
                  <p className="text-sm">
                    {typeFilter || yearFilter
                      ? 'Não há documentos com os filtros selecionados.'
                      : 'Ainda não há documentos publicados.'}
                  </p>
                  {(typeFilter || yearFilter) && (
                    <Button asChild variant="outline" className="mt-4">
                      <Link href="/documentos">Ver todos os documentos</Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
