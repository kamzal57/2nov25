'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useStore } from '@/lib/store'
import { Editor } from '@/components/editor/editor'
import { CommentsPanel } from '@/components/comments/comments-panel'

export default function DocumentPage() {
  const params = useParams()
  const docId = params?.docId as string
  const { setCurrentDocumentId, commentsOpen } = useStore()

  useEffect(() => {
    if (docId) {
      setCurrentDocumentId(docId)
    }

    return () => {
      setCurrentDocumentId(null)
    }
  }, [docId, setCurrentDocumentId])

  return (
    <div className="flex h-full">
      {/* Éditeur principal */}
      <div className={cn('flex-1 overflow-y-auto', commentsOpen && 'mr-96')}>
        <Editor documentId={docId} />
      </div>

      {/* Panel de commentaires */}
      {commentsOpen && <CommentsPanel documentId={docId} />}
    </div>
  )
}

// Helper pour className conditionnelle
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
