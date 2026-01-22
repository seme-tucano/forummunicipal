import Link from 'next/link'
import { ImageIcon, Calendar, Images } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import prisma from '@/lib/prisma'

export const metadata = {
  title: 'Galeria',
  description: 'Confira as fotos dos eventos, reuniões e atividades do Fórum Municipal da Educação.',
}

async function getAlbums() {
  const albums = await prisma.album.findMany({
    include: {
      _count: {
        select: {
          images: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return albums
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export const revalidate = 60

export default async function GaleriaPage() {
  const albums = await getAlbums()

  return (
    <>
      {/* Header */}
      <section className="gradient-hero text-white py-16 md:py-20">
        <div className="container-custom">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            Mídia
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Galeria de Fotos</h1>
          <p className="text-lg text-primary-100 max-w-2xl">
            Confira os registros fotográficos dos eventos, reuniões e atividades realizadas pelo Fórum Municipal da Educação.
          </p>
        </div>
      </section>

      {/* Albums */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          {albums.length > 0 ? (
            <>
              <div className="mb-8 flex items-center justify-between">
                <p className="text-gray-600">
                  <strong>{albums.length}</strong> álbum{albums.length !== 1 ? 's' : ''} disponíve{albums.length !== 1 ? 'is' : 'l'}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map((album) => (
                  <Link key={album.id} href={`/galeria/${album.slug}`} className="group">
                    <Card className="overflow-hidden h-full card-hover border-0 shadow-md">
                      {/* Cover Image */}
                      <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden">
                        {album.coverImage ? (
                          <img
                            src={album.coverImage}
                            alt={album.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Images className="h-16 w-16 text-primary-400" />
                          </div>
                        )}
                        <div className="absolute bottom-4 right-4">
                          <Badge className="bg-black/60 text-white border-0">
                            <ImageIcon className="h-3 w-3 mr-1" />
                            {album._count.images} foto{album._count.images !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 capitalize">
                          <Calendar className="h-4 w-4" />
                          {formatDate(album.createdAt)}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                          {album.name}
                        </h3>
                        {album.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {album.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <Images className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Nenhum álbum disponível</h3>
              <p className="text-sm">
                Ainda não há álbuns de fotos publicados.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
