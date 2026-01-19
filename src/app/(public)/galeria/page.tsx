import Link from 'next/link'
import { ImageIcon, Calendar, Images } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const albums = [
  {
    id: '1',
    name: 'Conferência Municipal de Educação 2025',
    slug: 'conferencia-2025',
    description: 'Registros fotográficos da Conferência Municipal de Educação realizada em novembro de 2025.',
    coverImage: null,
    imageCount: 45,
    date: 'Novembro 2025',
  },
  {
    id: '2',
    name: 'Posse dos Novos Conselheiros 2026-2028',
    slug: 'posse-conselheiros-2026',
    description: 'Cerimônia de posse dos novos conselheiros do Fórum para o biênio 2026-2028.',
    coverImage: null,
    imageCount: 28,
    date: 'Janeiro 2026',
  },
  {
    id: '3',
    name: 'Audiência Pública - Educação Infantil',
    slug: 'audiencia-educacao-infantil',
    description: 'Audiência pública para discussão das políticas de educação infantil no município.',
    coverImage: null,
    imageCount: 32,
    date: 'Dezembro 2025',
  },
  {
    id: '4',
    name: 'Reuniões Ordinárias 2025',
    slug: 'reunioes-2025',
    description: 'Compilado de fotos das reuniões ordinárias do Fórum ao longo de 2025.',
    coverImage: null,
    imageCount: 64,
    date: '2025',
  },
  {
    id: '5',
    name: 'Seminário de Formação Continuada',
    slug: 'seminario-formacao',
    description: 'Seminário realizado para formação de conselheiros e educadores.',
    coverImage: null,
    imageCount: 38,
    date: 'Outubro 2025',
  },
  {
    id: '6',
    name: 'Visitas às Escolas Municipais',
    slug: 'visitas-escolas',
    description: 'Registro das visitas técnicas realizadas pelo Fórum às escolas da rede municipal.',
    coverImage: null,
    imageCount: 52,
    date: 'Setembro 2025',
  },
]

export const metadata = {
  title: 'Galeria',
  description: 'Confira as fotos dos eventos, reuniões e atividades do Fórum Municipal da Educação.',
}

export default function GaleriaPage() {
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
          <div className="mb-8 flex items-center justify-between">
            <p className="text-gray-600">
              <strong>{albums.length}</strong> álbuns disponíveis
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <Link key={album.id} href={`/galeria/${album.slug}`} className="group">
                <Card className="overflow-hidden h-full card-hover border-0 shadow-md">
                  {/* Cover Image */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Images className="h-16 w-16 text-primary-400" />
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-black/60 text-white border-0">
                        <ImageIcon className="h-3 w-3 mr-1" />
                        {album.imageCount} fotos
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4" />
                      {album.date}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {album.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {album.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="default" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">
              Próxima
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
