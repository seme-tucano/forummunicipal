import Link from 'next/link'
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const currentMonth = 'Janeiro 2026'

const events = [
  {
    id: '1',
    title: 'Reunião Ordinária do Fórum',
    description: 'Reunião mensal para discussão de pautas e deliberações do Fórum Municipal da Educação.',
    date: '22 Jan 2026',
    day: '22',
    month: 'Jan',
    time: '14:00 - 17:00',
    location: 'Auditório da Secretaria de Educação',
    address: 'Rua da Educação, 123 - Centro',
    type: 'Reunião',
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'Conferência Municipal de Educação 2026',
    description: 'Grande evento bienal que reúne toda a comunidade educacional para debater e propor políticas para o município. Dois dias de palestras, debates e grupos de trabalho.',
    date: '25 Fev 2026',
    day: '25',
    month: 'Fev',
    time: '08:00 - 18:00',
    location: 'Centro de Convenções Municipal',
    address: 'Av. Principal, 500 - Centro',
    type: 'Conferência',
    status: 'upcoming',
    highlight: true,
  },
  {
    id: '3',
    title: 'Reunião Ordinária do Fórum',
    description: 'Reunião mensal para discussão de pautas e deliberações.',
    date: '26 Fev 2026',
    day: '26',
    month: 'Fev',
    time: '14:00 - 17:00',
    location: 'Auditório da Secretaria de Educação',
    address: 'Rua da Educação, 123 - Centro',
    type: 'Reunião',
    status: 'upcoming',
  },
  {
    id: '4',
    title: 'Audiência Pública - Orçamento da Educação',
    description: 'Audiência para apresentação e discussão da proposta orçamentária da educação para o exercício 2027.',
    date: '15 Mar 2026',
    day: '15',
    month: 'Mar',
    time: '09:00 - 12:00',
    location: 'Câmara Municipal',
    address: 'Praça Central, s/n - Centro',
    type: 'Audiência',
    status: 'upcoming',
  },
]

const pastEvents = [
  {
    id: '5',
    title: 'Posse dos Novos Conselheiros',
    date: '05 Jan 2026',
    type: 'Cerimônia',
  },
  {
    id: '6',
    title: 'Reunião Extraordinária - Aprovação do Calendário',
    date: '18 Dez 2025',
    type: 'Reunião',
  },
]

function getTypeColor(type: string) {
  switch (type) {
    case 'Conferência':
      return 'bg-amber-100 text-amber-700'
    case 'Reunião':
      return 'bg-blue-100 text-blue-700'
    case 'Audiência':
      return 'bg-emerald-100 text-emerald-700'
    case 'Cerimônia':
      return 'bg-purple-100 text-purple-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export const metadata = {
  title: 'Agenda',
  description: 'Confira a agenda de eventos, reuniões e atividades do Fórum Municipal da Educação.',
}

export default function AgendaPage() {
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
              {/* Month Navigation */}
              <div className="bg-white rounded-xl p-4 shadow-sm mb-6 flex items-center justify-between">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <h2 className="font-semibold text-gray-900">{currentMonth}</h2>
                <Button variant="ghost" size="sm">
                  Próximo
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              {/* Events */}
              <div className="space-y-4">
                {events.map((event) => (
                  <Card
                    key={event.id}
                    className={`overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow ${
                      event.highlight ? 'ring-2 ring-amber-400' : ''
                    }`}
                  >
                    <CardContent className="p-0">
                      <div className="flex">
                        {/* Date */}
                        <div className="w-20 md:w-28 bg-primary-600 text-white p-4 md:p-6 flex flex-col items-center justify-center shrink-0">
                          <span className="text-2xl md:text-3xl font-bold">{event.day}</span>
                          <span className="text-sm uppercase">{event.month}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4 md:p-6">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge className={getTypeColor(event.type)}>
                              {event.type}
                            </Badge>
                            {event.highlight && (
                              <Badge variant="outline" className="border-amber-400 text-amber-700">
                                Destaque
                              </Badge>
                            )}
                          </div>

                          <h3 className="font-semibold text-gray-900 text-lg mb-2">
                            {event.title}
                          </h3>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {event.description}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-primary-500" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-primary-500" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Eventos Recentes
                </h3>
                <ul className="space-y-3">
                  {pastEvents.map((event) => (
                    <li key={event.id} className="pb-3 border-b last:border-0 last:pb-0">
                      <p className="text-xs text-gray-500 mb-1">{event.date}</p>
                      <p className="text-sm font-medium text-gray-700">{event.title}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {event.type}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
