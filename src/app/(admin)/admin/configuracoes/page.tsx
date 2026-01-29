'use client'

import { useState, useEffect } from 'react'
import {
  Save,
  Loader2,
  Settings,
  Globe,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Image,
} from 'lucide-react'
import { AdminHeader } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface SocialLinks {
  facebook?: string | null
  instagram?: string | null
  youtube?: string | null
}

interface SiteSettings {
  id: string
  siteName: string
  description: string | null
  footerDescription: string | null
  logo: string | null
  favicon: string | null
  socialLinks: SocialLinks | null
  contactEmail: string | null
  address: string | null
  phone: string | null
}

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const [formData, setFormData] = useState({
    siteName: '',
    description: '',
    footerDescription: '',
    logo: '',
    favicon: '',
    contactEmail: '',
    address: '',
    phone: '',
    facebook: '',
    instagram: '',
    youtube: '',
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const res = await fetch('/api/settings', { credentials: 'include' })
      const data = await res.json()

      if (data.success && data.data) {
        const settings = data.data as SiteSettings
        setFormData({
          siteName: settings.siteName || '',
          description: settings.description || '',
          footerDescription: settings.footerDescription || '',
          logo: settings.logo || '',
          favicon: settings.favicon || '',
          contactEmail: settings.contactEmail || '',
          address: settings.address || '',
          phone: settings.phone || '',
          facebook: settings.socialLinks?.facebook || '',
          instagram: settings.socialLinks?.instagram || '',
          youtube: settings.socialLinks?.youtube || '',
        })
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setMessage(null)
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const payload = {
        siteName: formData.siteName || undefined,
        description: formData.description || null,
        footerDescription: formData.footerDescription || null,
        logo: formData.logo || null,
        favicon: formData.favicon || null,
        contactEmail: formData.contactEmail || null,
        address: formData.address || null,
        phone: formData.phone || null,
        socialLinks: {
          facebook: formData.facebook || null,
          instagram: formData.instagram || null,
          youtube: formData.youtube || null,
        },
      }

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao salvar configurações' })
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      setMessage({ type: 'error', text: 'Erro ao salvar configurações' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <>
      <AdminHeader
        title="Configurações"
        description="Gerencie as informações e aparência do portal"
      />

      <div className="p-6">
        <div className="max-w-4xl space-y-6">
          {/* Mensagem de feedback */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Informações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Informações Gerais
              </CardTitle>
              <CardDescription>
                Dados básicos do portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Site
                </label>
                <Input
                  id="siteName"
                  name="siteName"
                  value={formData.siteName}
                  onChange={handleChange}
                  placeholder="Fórum Municipal da Educação"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição SEO
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Breve descrição do portal para mecanismos de busca"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Aparece nos resultados de busca do Google
                </p>
              </div>
              <div>
                <label htmlFor="footerDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição do Rodapé
                </label>
                <Textarea
                  id="footerDescription"
                  name="footerDescription"
                  value={formData.footerDescription}
                  onChange={handleChange}
                  placeholder="Espaço de articulação entre a sociedade civil e o poder público..."
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Texto institucional exibido no rodapé do site
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Imagens */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Imagens
              </CardTitle>
              <CardDescription>
                Logo e favicon do portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                  URL do Logo
                </label>
                <Input
                  id="logo"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/logo.png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recomendado: PNG ou SVG com fundo transparente
                </p>
              </div>
              <div>
                <label htmlFor="favicon" className="block text-sm font-medium text-gray-700 mb-2">
                  URL do Favicon
                </label>
                <Input
                  id="favicon"
                  name="favicon"
                  value={formData.favicon}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/favicon.ico"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ícone que aparece na aba do navegador (32x32 pixels)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Informações de Contato
              </CardTitle>
              <CardDescription>
                Dados para contato com o Fórum
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email de Contato
                </label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="contato@forum.edu.br"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Telefone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(00) 0000-0000"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Endereço
                </label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Rua Example, 123 - Centro&#10;Cidade - Estado, CEP 00000-000"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Redes Sociais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Redes Sociais
              </CardTitle>
              <CardDescription>
                Links para as redes sociais do Fórum
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-2">
                  <Facebook className="h-4 w-4 inline mr-1" />
                  Facebook
                </label>
                <Input
                  id="facebook"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/forummunicipal"
                />
              </div>
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                  <Instagram className="h-4 w-4 inline mr-1" />
                  Instagram
                </label>
                <Input
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/forummunicipal"
                />
              </div>
              <div>
                <label htmlFor="youtube" className="block text-sm font-medium text-gray-700 mb-2">
                  <Youtube className="h-4 w-4 inline mr-1" />
                  YouTube
                </label>
                <Input
                  id="youtube"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleChange}
                  placeholder="https://youtube.com/@forummunicipal"
                />
              </div>
            </CardContent>
          </Card>

          {/* Botão Salvar */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              size="lg"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Salvar Configurações
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
