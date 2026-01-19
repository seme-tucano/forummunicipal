import Link from 'next/link'
import { ArrowLeft, Calendar, User, Tag, Share2, Facebook, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// Dados mockados
const post = {
  id: '1',
  title: 'Fórum aprova novas diretrizes para o Plano Municipal de Educação',
  excerpt: 'Em reunião extraordinária realizada nesta semana, foram definidas as metas prioritárias para os próximos dois anos com foco na educação infantil e inclusão.',
  content: `
    <p>O Fórum Municipal da Educação realizou nesta quinta-feira (15) uma reunião extraordinária para discutir e aprovar as novas diretrizes do Plano Municipal de Educação (PME) para o biênio 2026-2028.</p>

    <p>Durante o encontro, que contou com a participação de representantes de diversos segmentos da comunidade educacional, foram definidas as metas prioritárias com foco especial na educação infantil e na inclusão de estudantes com deficiência.</p>

    <h2>Principais deliberações</h2>

    <p>Entre as principais deliberações da reunião, destacam-se:</p>

    <ul>
      <li>Ampliação de vagas na educação infantil, com meta de atendimento de 100% da demanda manifesta até 2028;</li>
      <li>Implementação de programa de formação continuada para professores da rede municipal;</li>
      <li>Criação de comissão especial para acompanhamento das políticas de inclusão;</li>
      <li>Estabelecimento de indicadores de qualidade para monitoramento das metas do PME.</li>
    </ul>

    <h2>Participação social</h2>

    <p>A presidente do Fórum, Maria Silva, destacou a importância da participação social na construção das políticas educacionais: "Este é um momento histórico para a educação do nosso município. As diretrizes aprovadas hoje são fruto de um amplo processo de discussão com a sociedade civil, educadores e gestores públicos".</p>

    <blockquote>
      "A educação de qualidade é um direito de todos e um dever do Estado. O Fórum Municipal da Educação tem o compromisso de zelar pelo cumprimento desse direito."
    </blockquote>

    <h2>Próximos passos</h2>

    <p>As novas diretrizes serão encaminhadas à Secretaria Municipal de Educação para implementação. O Fórum acompanhará o processo e realizará avaliações periódicas do cumprimento das metas estabelecidas.</p>

    <p>A próxima reunião ordinária do Fórum está agendada para o dia 30 de janeiro, quando serão discutidos os indicadores de acompanhamento do PME.</p>
  `,
  category: { name: 'Institucional', slug: 'institucional' },
  tags: [
    { name: 'PME', slug: 'pme' },
    { name: 'Diretrizes', slug: 'diretrizes' },
    { name: 'Educação Infantil', slug: 'educacao-infantil' },
  ],
  author: { name: 'Equipe de Comunicação' },
  publishedAt: '15 de janeiro de 2026',
  readTime: '4 min de leitura',
}

const relatedPosts = [
  {
    id: '2',
    title: 'Publicado relatório de acompanhamento das metas do PME',
    date: '10 Jan 2026',
    slug: 'relatorio-acompanhamento-metas-pme',
  },
  {
    id: '3',
    title: 'Nova composição do Fórum toma posse para biênio 2026-2028',
    date: '05 Jan 2026',
    slug: 'nova-composicao-forum-2026-2028',
  },
]

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return (
    <>
      {/* Header */}
      <section className="gradient-hero text-white py-12 md:py-16">
        <div className="container-custom">
          <Link
            href="/noticias"
            className="inline-flex items-center text-primary-200 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para notícias
          </Link>

          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            {post.category.name}
          </Badge>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 max-w-4xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-primary-200">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {post.publishedAt}
            </span>
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {post.author.name}
            </span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {/* Lead */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Article content */}
            <article
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary-600 prose-blockquote:border-primary-500 prose-blockquote:text-gray-600 prose-li:text-gray-600"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="mt-10 pt-6 border-t">
              <div className="flex items-center gap-3 flex-wrap">
                <Tag className="h-4 w-4 text-gray-400" />
                {post.tags.map((tag) => (
                  <Link key={tag.slug} href={`/noticias?tag=${tag.slug}`}>
                    <Badge variant="secondary" className="hover:bg-primary-100">
                      {tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Share2 className="h-5 w-5" />
                  <span className="font-medium">Compartilhar:</span>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Notícias Relacionadas</h2>
            <div className="space-y-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/noticias/${related.slug}`}
                  className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <p className="text-sm text-gray-500 mb-1">{related.date}</p>
                  <h3 className="font-medium text-gray-900 hover:text-primary-600">
                    {related.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
