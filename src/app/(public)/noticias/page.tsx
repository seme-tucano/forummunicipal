import Link from 'next/link'
import { Newspaper, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import prisma from '@/lib/prisma'

export const metadata = {
  title: 'Notícias',
  description: 'Acompanhe as últimas notícias e informações do Fórum Municipal da Educação.',
}

async function getNews(categorySlug?: string) {
  const where: Record<string, unknown> = {
    status: 'PUBLISHED',
  }

  if (categorySlug && categorySlug !== 'todas') {
    where.category = {
      slug: categorySlug,
    }
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: {
      publishedAt: 'desc',
    },
    include: {
      category: true,
    },
  })
  return posts
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          posts: {
            where: {
              status: 'PUBLISHED',
            },
          },
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })
  return categories
}

async function getTotalPublishedPosts() {
  return await prisma.post.count({
    where: {
      status: 'PUBLISHED',
    },
  })
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export const revalidate = 60

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>
}) {
  const params = await searchParams
  const categorySlug = params.categoria

  const [news, categories, totalPosts] = await Promise.all([
    getNews(categorySlug),
    getCategories(),
    getTotalPublishedPosts(),
  ])

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
              {/* Categories */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Categorias
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/noticias"
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-primary-50 hover:text-primary-700 transition-colors ${
                        !categorySlug ? 'bg-primary-50 text-primary-700 font-medium' : ''
                      }`}
                    >
                      <span>Todas</span>
                      <Badge variant="secondary" className="text-xs">
                        {totalPosts}
                      </Badge>
                    </Link>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/noticias?categoria=${category.slug}`}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-primary-50 hover:text-primary-700 transition-colors ${
                          categorySlug === category.slug ? 'bg-primary-50 text-primary-700 font-medium' : ''
                        }`}
                      >
                        <span>{category.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {category._count.posts}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* News List */}
            <div className="flex-1">
              {news.length > 0 ? (
                <div className="space-y-6">
                  {news.map((item) => (
                    <Link key={item.id} href={`/noticias/${item.slug}`} className="block group">
                      <Card className="overflow-hidden card-hover border-0 shadow-sm">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-64 lg:w-80 shrink-0">
                              {item.coverImage ? (
                                <img
                                  src={item.coverImage}
                                  alt={item.title}
                                  className="w-full h-full object-cover aspect-[16/10] md:aspect-auto md:h-full"
                                />
                              ) : (
                                <div className="aspect-[16/10] md:aspect-auto md:h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center min-h-[160px]">
                                  <Newspaper className="h-12 w-12 text-primary-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 p-6">
                              <div className="flex items-center gap-3 mb-3">
                                <Badge variant="outline">{item.category?.name || 'Notícia'}</Badge>
                                <span className="text-sm text-gray-500">
                                  {item.publishedAt ? formatDate(item.publishedAt) : formatDate(item.createdAt)}
                                </span>
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
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <Newspaper className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma notícia encontrada</h3>
                  <p className="text-sm">
                    {categorySlug
                      ? 'Não há notícias nesta categoria ainda.'
                      : 'Ainda não há notícias publicadas.'}
                  </p>
                  {categorySlug && (
                    <Button asChild variant="outline" className="mt-4">
                      <Link href="/noticias">Ver todas as notícias</Link>
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
