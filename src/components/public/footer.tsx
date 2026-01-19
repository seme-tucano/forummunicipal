import Link from 'next/link'
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

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
    { name: 'Política de Privacidade', href: '/privacidade' },
    { name: 'Área Restrita', href: '/admin' },
  ],
  social: [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'YouTube', href: '#', icon: Youtube },
  ],
}

export function Footer() {
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
              Espaço de articulação entre a sociedade civil e o poder público para
              discutir, propor e acompanhar as políticas educacionais do município.
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
              <li className="flex items-start gap-3 text-sm text-primary-200">
                <MapPin className="h-5 w-5 shrink-0 text-primary-400" />
                <span>
                  Rua da Educação, 123<br />
                  Centro - CEP 00000-000
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-200">
                <Phone className="h-5 w-5 shrink-0 text-primary-400" />
                <span>(00) 0000-0000</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-200">
                <Mail className="h-5 w-5 shrink-0 text-primary-400" />
                <span>contato@fme.edu.br</span>
              </li>
            </ul>

            {/* Redes Sociais */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Siga-nos</h4>
              <div className="flex gap-3">
                {navigation.social.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label={item.name}
                  >
                    <item.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-primary-300 text-center">
            &copy; {new Date().getFullYear()} Fórum Municipal da Educação. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
