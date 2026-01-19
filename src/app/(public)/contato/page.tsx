'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const contactInfo = [
  {
    icon: MapPin,
    title: 'Endereço',
    content: 'Rua da Educação, 123\nCentro - CEP 00000-000',
  },
  {
    icon: Phone,
    title: 'Telefone',
    content: '(00) 0000-0000',
  },
  {
    icon: Mail,
    title: 'E-mail',
    content: 'contato@fme.edu.br',
  },
  {
    icon: Clock,
    title: 'Horário de Atendimento',
    content: 'Segunda a Sexta\n08h às 17h',
  },
]

export default function ContatoPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simular envio
    setSubmitted(true)
  }

  return (
    <>
      {/* Header */}
      <section className="gradient-hero text-white py-16 md:py-20">
        <div className="container-custom">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            Fale Conosco
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contato</h1>
          <p className="text-lg text-primary-100 max-w-2xl">
            Entre em contato conosco para dúvidas, sugestões ou para saber mais sobre as atividades do Fórum Municipal da Educação.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Informações de Contato
              </h2>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                        <info.icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{info.title}</h3>
                        <p className="text-sm text-gray-600 whitespace-pre-line">
                          {info.content}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="mt-6 aspect-[4/3] rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <div className="text-center p-4">
                  <MapPin className="h-12 w-12 text-primary-400 mx-auto mb-2" />
                  <p className="text-sm text-primary-600">Mapa de localização</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Envie sua Mensagem
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Preencha o formulário abaixo e entraremos em contato o mais breve possível.
                  </p>

                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Mensagem Enviada!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Agradecemos seu contato. Responderemos em breve.
                      </p>
                      <Button onClick={() => setSubmitted(false)}>
                        Enviar nova mensagem
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Nome completo *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            required
                            placeholder="Seu nome"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            E-mail *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="seu@email.com"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Telefone
                          </label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="(00) 00000-0000"
                          />
                        </div>
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                            Assunto *
                          </label>
                          <Input
                            id="subject"
                            name="subject"
                            required
                            placeholder="Assunto da mensagem"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                          Mensagem *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          placeholder="Escreva sua mensagem aqui..."
                        />
                      </div>

                      <div className="flex items-start gap-3">
                        <input
                          id="privacy"
                          name="privacy"
                          type="checkbox"
                          required
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="privacy" className="text-sm text-gray-600">
                          Li e concordo com a <a href="/privacidade" className="text-primary-600 hover:underline">Política de Privacidade</a>. *
                        </label>
                      </div>

                      <Button type="submit" size="lg" className="w-full sm:w-auto">
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Mensagem
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-gray-600 mb-8">
              Confira algumas das perguntas mais comuns sobre o Fórum Municipal da Educação.
            </p>

            <div className="space-y-4 text-left">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Como posso participar das reuniões do Fórum?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    As reuniões ordinárias do Fórum são abertas ao público. Consulte nossa agenda para saber as datas e locais das próximas reuniões.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Como posso me tornar conselheiro do Fórum?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Os conselheiros são indicados por suas entidades representativas. Para mais informações, entre em contato com a secretaria executiva do Fórum.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Onde encontro as atas das reuniões anteriores?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Todas as atas estão disponíveis na seção de Documentos do nosso portal. Você pode filtrar por tipo de documento e ano.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
