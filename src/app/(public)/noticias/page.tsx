import Link from 'next/link'
import { Newspaper, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

// Dados mockados
const categories = [
  { id: '1', name: 'Todas', slug: 'todas', count: 24 },
  { id: '2', name: 'Institucional', slug: 'institucional', count: 10 },
  { id: '3', name: 'Eventos', slug: 'eventos', count: 8 },
  { id: '4', name: 'Documentos', slug: 'documentos', count: 6 },
]

const news = [
  {
    id: '1',
    title: 'Fórum aprova novas diretrizes para o Plano Municipal de Educação',
    excerpt: 'Em reunião extraordinária realizada nesta semana, foram definidas as metas prioritárias para os próximos dois anos com foco na educação infantil e inclusão. Os conselheiros discutiram também estratégias de financiamento.',
    category: 'Institucional',
    date: '15 Jan 2026',
    slug: 'forum-aprova-novas-diretrizes-pme',
  },
  {
    id: '2',
    title: 'Inscrições abertas para a Conferência Municipal de Educação 2026',
    excerpt: 'O evento acontece nos dias 25 e 26 de fevereiro e reunirá educadores, gestores e sociedade civil para debater o futuro da educação no município. As inscrições são gratuitas e podem ser feitas pelo portal.',
    category: 'Eventos',
    date: '12 Jan 2026',
    slug: 'inscricoes-conferencia-municipal-2026',
  },
  {
    id: '3',
    title: 'Publicado relatório de acompanhamento das metas do PME',
    excerpt: 'O documento apresenta análise detalhada do cumprimento das metas estabelecidas no Plano Municipal de Educação e propõe ações corretivas para o próximo período de avaliação.',
    category: 'Documentos',
    date: '10 Jan 2026',
    slug: 'relatorio-acompanhamento-metas-pme',
  },
  {
    id: '4',
    title: 'Fórum realiza audiência pública sobre educação inclusiva',
    excerpt: 'Representantes da comunidade escolar e especialistas debateram políticas e práticas para garantir a inclusão de estudantes com deficiência nas escolas municipais.',
    category: 'Eventos',
    date: '08 Jan 2026',
    slug: 'audiencia-publica-educacao-inclusiva',
  },
  {
    id: '5',
    title: 'Nova composição do Fórum toma posse para biênio 2026-2028',
    excerpt: 'Em cerimônia realizada no auditório da Secretaria de Educação, os novos conselheiros do Fórum Municipal da Educação foram empossados para o biênio 2026-2028.',
    category: 'Institucional',
    date: '05 Jan 2026',
    slug: 'nova-composicao-forum-2026-2028',
  },
  {
    id: '6',
    title: 'Divulgado calendário de reuniões ordinárias para 2026',
    excerpt: 'O Fórum Municipal da Educação divulgou o calendário completo de reuniões ordinárias para o ano de 2026. As reuniões acontecem sempre na última quinta-feira de cada mês.',
    category: 'Institucional',
    date: '02 Jan 2026',
    slug: 'calendario-reunioes-2026',
  },
]

export const metadata = {
  title: 'Notícias',
  description: 'Acompanhe as últimas notícias e informações do Fórum Municipal da Educação.',
}

export default function NoticiasPage() {
  return (
    <>
      {/* Header */}
      <section className="gradient-hero text-white py-16 md:py-20">
        <div className="container-custom">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            Comunicação
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Notícias</h1>
          <p className="text-lg text-primary-100 max-w-2xl">
            Fique por dentro das últimas novidades, eventos e publicações do Fórum Municipal da Educação.
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
                    placeholder="Buscar notícias..."
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Categorias
                </h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/noticias?categoria=${category.slug}`}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        <span>{category.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* News List */}
            <div className="flex-1">
              <div className="space-y-6">
                {news.map((item) => (
                  <Link key={item.id} href={`/noticias/${item.slug}`} className="block group">
                    <Card className="overflow-hidden card-hover border-0 shadow-sm">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-64 lg:w-80 shrink-0">
                            <div className="aspect-[16/10] md:aspect-auto md:h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                              <Newspaper className="h-12 w-12 text-primary-400" />
                            </div>
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge variant="outline">{item.category}</Badge>
                              <span className="text-sm text-gray-500">{item.date}</span>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                              {item.title}
                            </h2>
                            <p className="text-gray-600 line-clamp-2">
                              {item.excerpt}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
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
