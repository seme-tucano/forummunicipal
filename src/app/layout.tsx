import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const inter = localFont({
  src: './fonts/InterVariable.woff2',
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Fórum Municipal da Educação',
    template: '%s | Fórum Municipal da Educação',
  },
  description: 'Portal oficial do Fórum Municipal da Educação. Acesse notícias, documentos, atas, resoluções e acompanhe a agenda de eventos.',
  keywords: ['educação', 'fórum', 'municipal', 'políticas educacionais', 'plano municipal de educação'],
  authors: [{ name: 'Fórum Municipal da Educação' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Fórum Municipal da Educação',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans">
        {children}
      </body>
    </html>
  )
}
