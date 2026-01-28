import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, User, Tag, Share2, Facebook, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import prisma from '@/lib/prisma'

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function calculateReadTime(content: string) {
  const wordsPerMinute = 200
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min de leitura`
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: {
      slug,
      status: 'PUBLISHED'
    },
    include: {
      author: {
        select: { name: true }
      },
      category: {
        select: { name: true, slug: true }
      },
      tags: {
        include: {
          tag: true
        }
      }
    }
  })
  return post
}

async function getRelatedPosts(categoryId: string | null, currentPostId: string) {
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: currentPostId },
      ...(categoryId && { categoryId })
    },
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true
    },
    orderBy: { publishedAt: 'desc' },
    take: 3
  })
  return posts
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return {
      title: 'Noticia nao encontrada'
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.categoryId, post.id)
  const readTime = calculateReadTime(post.content)

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
            Voltar para noticias
          </Link>

          {post.category && (
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              {post.category.name}
            </Badge>
          )}

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 max-w-4xl text-white">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-primary-200">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {post.author.name}
            </span>
            <span>{readTime}</span>
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

            {/* Cover Image */}
            {post.coverImage && (
              <div className="mb-8">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {/* Article content */}
            <article
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary-600 prose-blockquote:border-primary-500 prose-blockquote:text-gray-600 prose-li:text-gray-600"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t">
                <div className="flex items-center gap-3 flex-wrap">
                  <Tag className="h-4 w-4 text-gray-400" />
                  {post.tags.map((postTag) => (
                    <Link key={postTag.tag.slug} href={`/noticias?tag=${postTag.tag.slug}`}>
                      <Badge variant="secondary" className="hover:bg-primary-100">
                        {postTag.tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

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
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Noticias Relacionadas</h2>
              <div className="space-y-4">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/noticias/${related.slug}`}
                    className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                  >
                    <p className="text-sm text-gray-500 mb-1">
                      {related.publishedAt ? formatDate(related.publishedAt) : ''}
                    </p>
                    <h3 className="font-medium text-gray-900 hover:text-primary-600">
                      {related.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
