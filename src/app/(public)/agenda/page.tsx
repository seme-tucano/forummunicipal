import { Calendar, MapPin, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import prisma from '@/lib/prisma'

export const metadata = {
  title: 'Agenda',
  description: 'Confira a agenda de eventos, reuniões e atividades do Fórum Municipal da Educação.',
}

async function getUpcomingEvents() {
  const events = await prisma.event.findMany({
    where: {
      published: true,
      startDate: {
        gte: new Date(),
      },
    },
    orderBy: {
      startDate: 'asc',
    },
  })
  return events
}

async function getPastEvents() {
  const events = await prisma.event.findMany({
    where: {
      published: true,
      startDate: {
        lt: new Date(),
      },
    },
    orderBy: {
      startDate: 'desc',
    },
    take: 5,
  })
  return events
}

function formatEventDate(date: Date) {
  const day = date.getDate().toString().padStart(2, '0')
  const month = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date)
  return { day, month: month.replace('.', '') }
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function formatFullDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export const revalidate = 60

export default async function AgendaPage() {
  const [upcomingEvents, pastEvents] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ])

  return (
    <>
      {/* Header */}
      <section className="gradient-hero text-white py-16 md:py-20">
        <div className="container-custom">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            Calendário
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Agenda de Eventos</h1>
          <p className="text-lg text-primary-100 max-w-2xl">
            Acompanhe as próximas reuniões, conferências, audiências públicas e demais eventos do Fórum Municipal da Educação.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="lg:flex lg:gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Próximos Eventos</h2>

              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => {
                    const dateInfo = formatEventDate(event.startDate)
                    const timeStart = formatTime(event.startDate)
                    const timeEnd = event.endDate ? formatTime(event.endDate) : null

                    return (
                      <Card
                        key={event.id}
                        className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-0">
                          <div className="flex">
                            {/* Date */}
                            <div className="w-20 md:w-28 bg-primary-600 text-white p-4 md:p-6 flex flex-col items-center justify-center shrink-0">
                              <span className="text-2xl md:text-3xl font-bold">{dateInfo.day}</span>
                              <span className="text-sm uppercase">{dateInfo.month}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-4 md:p-6">
                              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                                {event.title}
                              </h3>

                              {event.description && (
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                  {event.description}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1.5">
                                  <Clock className="h-4 w-4 text-primary-500" />
                                  {timeStart}{timeEnd ? ` - ${timeEnd}` : ''}
                                </span>
                                {event.location && (
                                  <span className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4 text-primary-500" />
                                    {event.location}
                                  </span>
                                )}
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
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Nenhum evento programado</h3>
                  <p className="text-sm">
                    Não há eventos futuros cadastrados no momento.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:w-80 shrink-0 mt-8 lg:mt-0">
              {/* Quick Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary-600" />
                  Reuniões Ordinárias
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  As reuniões ordinárias do Fórum acontecem na <strong>última quinta-feira de cada mês</strong>,
                  às 14h, no Auditório da Secretaria de Educação.
                </p>
                <p className="text-xs text-gray-500">
                  As reuniões são abertas ao público.
                </p>
              </div>

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Eventos Recentes
                  </h3>
                  <ul className="space-y-3">
                    {pastEvents.map((event) => (
                      <li key={event.id} className="pb-3 border-b last:border-0 last:pb-0">
                        <p className="text-xs text-gray-500 mb-1">{formatFullDate(event.startDate)}</p>
                        <p className="text-sm font-medium text-gray-700">{event.title}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
