import Link from 'next/link'
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import prisma from '@/lib/prisma'

const navigation = {
  principal: [
    { name: 'Início', href: '/' },
    { name: 'Notícias', href: '/noticias' },
    { name: 'Documentos', href: '/documentos' },
    { name: 'Galeria', href: '/galeria' },
  ],
  institucional: [
    { name: 'Agenda', href: '/agenda' },
    { name: 'Contato', href: '/contato' },
    { name: 'Área Restrita', href: '/login' },
  ],
}

interface SocialLinks {
  facebook?: string | null
  instagram?: string | null
  youtube?: string | null
}

async function getSettings() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'main' }
    })
    return settings
  } catch {
    return null
  }
}

export async function Footer() {
  const settings = await getSettings()

  const socialLinks = settings?.socialLinks as SocialLinks | null

  const hasSocialLinks = socialLinks?.facebook || socialLinks?.instagram || socialLinks?.youtube

  return (
    <footer className="bg-primary-900 text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Rodapé</h2>

      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo e descrição */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-white font-bold text-lg">FME</span>
              </div>
              <div>
                <span className="text-lg font-bold">Fórum Municipal</span>
                <span className="block text-xs text-primary-200">da Educação</span>
              </div>
            </div>
            <p className="text-sm text-primary-200 leading-relaxed">
              {settings?.description ||
                'Espaço de articulação entre a sociedade civil e o poder público para discutir, propor e acompanhar as políticas educacionais do município.'}
            </p>
          </div>

          {/* Links Principais */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Navegação
            </h3>
            <ul className="space-y-3">
              {navigation.principal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-primary-200 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Institucionais */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Institucional
            </h3>
            <ul className="space-y-3">
              {navigation.institucional.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-primary-200 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Contato
            </h3>
            <ul className="space-y-3">
              {settings?.address && (
                <li className="flex items-start gap-3 text-sm text-primary-200">
                  <MapPin className="h-5 w-5 shrink-0 text-primary-400" />
                  <span className="whitespace-pre-line">{settings.address}</span>
                </li>
              )}
              {settings?.phone && (
                <li className="flex items-center gap-3 text-sm text-primary-200">
                  <Phone className="h-5 w-5 shrink-0 text-primary-400" />
                  <span>{settings.phone}</span>
                </li>
              )}
              {settings?.contactEmail && (
                <li className="flex items-center gap-3 text-sm text-primary-200">
                  <Mail className="h-5 w-5 shrink-0 text-primary-400" />
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition-colors">
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {!settings?.address && !settings?.phone && !settings?.contactEmail && (
                <li className="text-sm text-primary-300">
                  Configure as informações de contato no painel administrativo.
                </li>
              )}
            </ul>

            {/* Redes Sociais */}
            {hasSocialLinks && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3">Siga-nos</h4>
                <div className="flex gap-3">
                  {socialLinks?.facebook && (
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  )}
                  {socialLinks?.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                  {socialLinks?.youtube && (
                    <a
                      href={socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                      aria-label="YouTube"
                    >
                      <Youtube className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-primary-300 text-center">
            &copy; {new Date().getFullYear()} {settings?.siteName || 'Fórum Municipal da Educação'}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
