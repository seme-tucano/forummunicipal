import { Header, Footer } from '@/components/public'

// Revalidar a cada 60 segundos para atualizar dados do rodapé
export const revalidate = 60

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
