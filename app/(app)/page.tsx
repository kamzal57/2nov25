'use client'

import { redirect } from 'next/navigation'
import { useStore } from '@/lib/store'
import { useEffect } from 'react'

export default function AppPage() {
  const { documents } = useStore()

  useEffect(() => {
    // Rediriger vers le dernier document ouvert ou créer un nouveau
    if (documents.length > 0) {
      const lastDoc = documents.sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )[0]
      redirect(`/app/documents/${lastDoc.id}`)
    }
  }, [documents])

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-muted-foreground">
          Aucun document ouvert
        </h2>
        <p className="text-sm text-muted-foreground">
          Créez un nouveau document ou ouvrez-en un existant
        </p>
      </div>
    </div>
  )
}
