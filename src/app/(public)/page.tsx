import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  FileText,
  Calendar,
  ImageIcon,
  Newspaper,
  Users,
  BookOpen,
  Target,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Dados mockados para demonstração
const featuredNews = [
  {
    id: '1',
    title: 'Fórum aprova novas diretrizes para o Plano Municipal de Educação',
    excerpt: 'Em reunião extraordinária, foram definidas as metas prioritárias para os próximos dois anos com foco na educação infantil e inclusão.',
    category: 'Institucional',
    date: '15 Jan 2026',
    image: '/placeholder-news-1.jpg',
    slug: 'forum-aprova-novas-diretrizes-pme',
  },
  {
    id: '2',
    title: 'Inscrições abertas para a Conferência Municipal de Educação',
    excerpt: 'Evento acontece nos dias 25 e 26 de fevereiro e reunirá educadores, gestores e sociedade civil para debater o futuro da educação.',
    category: 'Eventos',
    date: '12 Jan 2026',
    image: '/placeholder-news-2.jpg',
    slug: 'inscricoes-conferencia-municipal',
  },
  {
    id: '3',
    title: 'Publicado relatório de acompanhamento das metas do PME',
    excerpt: 'Documento apresenta análise detalhada do cumprimento das metas estabelecidas e propõe ações corretivas para o próximo período.',
    category: 'Documentos',
    date: '10 Jan 2026',
    image: '/placeholder-news-3.jpg',
    slug: 'relatorio-acompanhamento-metas-pme',
  },
]

const quickLinks = [
  {
    title: 'Notícias',
    description: 'Fique por dentro das últimas novidades',
    icon: Newspaper,
    href: '/noticias',
    color: 'bg-blue-500',
  },
  {
    title: 'Documentos',
    description: 'Atas, resoluções e pareceres',
    icon: FileText,
    href: '/documentos',
    color: 'bg-emerald-500',
  },
  {
    title: 'Agenda',
    description: 'Próximos eventos e reuniões',
    icon: Calendar,
    href: '/agenda',
    color: 'bg-amber-500',
  },
  {
    title: 'Galeria',
    description: 'Fotos e registros das atividades',
    icon: ImageIcon,
    href: '/galeria',
    color: 'bg-purple-500',
  },
]

const upcomingEvents = [
  {
    id: '1',
    title: 'Reunião Ordinária do Fórum',
    date: '22 Jan 2026',
    time: '14:00',
    location: 'Auditório da Secretaria de Educação',
  },
  {
    id: '2',
    title: 'Conferência Municipal de Educação',
    date: '25 Fev 2026',
    time: '08:00',
    location: 'Centro de Convenções',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative gradient-hero text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container-custom relative">
          <div className="py-20 md:py-28 lg:py-32">
            <div className="max-w-3xl">
              <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                Bem-vindo ao Portal
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
                Fórum Municipal da Educação
              </h1>
              <p className="text-lg md:text-xl text-primary-100 mb-8 leading-relaxed max-w-2xl">
                Espaço de articulação entre a sociedade civil e o poder público para
                discutir, propor e acompanhar as políticas educacionais do nosso município.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="xl" className="bg-white text-primary-700 hover:bg-primary-50">
                  <Link href="/noticias">
                    Ver Notícias
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl" className="border-white text-white hover:bg-white/10">
                  <Link href="/documentos">
                    Acessar Documentos
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Quick Links */}
      <section className="section-padding bg-white -mt-1">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {quickLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="group"
              >
                <Card className="h-full card-hover border-0 shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${link.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                      <link.icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{link.title}</h3>
                    <p className="text-sm text-gray-500">{link.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Sobre o Fórum</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Construindo juntos o futuro da educação
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                O Fórum Municipal da Educação é um espaço permanente de debate e articulação,
                composto por representantes da sociedade civil, gestores públicos, educadores
                e demais atores envolvidos com a educação municipal.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                    <Target className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Nossa Missão</h4>
                    <p className="text-sm text-gray-600">Coordenar e articular as políticas educacionais no âmbito municipal.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Participação Social</h4>
                    <p className="text-sm text-gray-600">Garantir a participação da sociedade nas decisões sobre educação.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Acompanhamento do PME</h4>
                    <p className="text-sm text-gray-600">Monitorar e avaliar a implementação do Plano Municipal de Educação.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="h-24 w-24 mx-auto rounded-full bg-primary-500 flex items-center justify-center mb-4">
                      <Users className="h-12 w-12 text-white" />
                    </div>
                    <p className="text-primary-700 font-medium">
                      Imagem institucional
                    </p>
                  </div>
                </div>
              </div>
              {/* Stats card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 max-w-[200px]">
                <div className="text-3xl font-bold text-primary-600 mb-1">10+</div>
                <div className="text-sm text-gray-600">Anos de atuação pela educação</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-10">
            <div>
              <Badge variant="outline" className="mb-4">Notícias</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Últimas Publicações
              </h2>
            </div>
            <Button asChild variant="ghost" className="hidden md:flex">
              <Link href="/noticias">
                Ver todas
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredNews.map((news, index) => (
              <Link key={news.id} href={`/noticias/${news.slug}`} className="group">
                <Card className="h-full overflow-hidden card-hover border-0 shadow-md">
                  <div className="aspect-[16/10] bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Newspaper className="h-12 w-12 text-primary-400" />
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-primary-700 hover:bg-white">
                        {news.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-500 mb-2">{news.date}</p>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {news.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline">
              <Link href="/noticias">
                Ver todas as notícias
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section-padding bg-primary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-4">Agenda</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Próximos Eventos
              </h2>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-32 bg-primary-600 text-white p-4 sm:p-6 flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-0">
                        <span className="text-2xl sm:text-3xl font-bold">{event.date.split(' ')[0]}</span>
                        <span className="text-sm uppercase">{event.date.split(' ')[1]} {event.date.split(' ')[2]}</span>
                      </div>
                      <div className="flex-1 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                          <p className="text-sm text-gray-500">
                            <span>{event.time}</span>
                            <span className="mx-2">•</span>
                            <span>{event.location}</span>
                          </p>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/agenda`}>
                            Detalhes
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button asChild>
                <Link href="/agenda">
                  Ver agenda completa
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-hero text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Entre em Contato
            </h2>
            <p className="text-lg text-primary-100 mb-8">
              Tem dúvidas, sugestões ou deseja participar das atividades do Fórum?
              Estamos à disposição para atendê-lo.
            </p>
            <Button asChild size="xl" className="bg-white text-primary-700 hover:bg-primary-50">
              <Link href="/contato">
                Fale Conosco
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
