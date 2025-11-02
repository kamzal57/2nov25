'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { fetchUserData, fetchDocumentsAndFolders, sidebarWidth } = useStore()

  useEffect(() => {
    // Vérifier l'authentification et charger les données
    const initializeApp = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      // Charger les données de l'utilisateur
      await fetchUserData()
      await fetchDocumentsAndFolders()

      // Écouter les changements d'authentification
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push('/login')
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    }

    initializeApp()
  }, [fetchUserData, fetchDocumentsAndFolders, router])

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
