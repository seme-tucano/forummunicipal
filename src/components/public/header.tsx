'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Início', href: '/' },
  { name: 'Notícias', href: '/noticias' },
  { name: 'Documentos', href: '/documentos' },
  { name: 'Galeria', href: '/galeria' },
  { name: 'Agenda', href: '/agenda' },
  { name: 'Contato', href: '/contato' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav className="container-custom" aria-label="Navegação principal">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">FME</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-primary-700">Fórum Municipal</span>
                <span className="block text-xs text-gray-500">da Educação</span>
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors relative py-2 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary-600 after:transition-all hover:after:w-full"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin">
                Área Restrita
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={cn(
        'lg:hidden fixed inset-0 z-50 transition-opacity duration-300',
        mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu panel */}
        <div className={cn(
          'fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl transition-transform duration-300',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}>
          <div className="flex items-center justify-between p-6 border-b">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">FME</span>
              </div>
              <span className="font-bold text-primary-700">Fórum Municipal</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fechar menu"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="p-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-4 py-3 text-base font-medium text-gray-900 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t">
              <Button asChild className="w-full" size="lg">
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                  Área Restrita
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
