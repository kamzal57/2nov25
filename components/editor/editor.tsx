'use client'

import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/lib/store'
import { debounce } from '@/lib/utils'
import { BubbleMenu } from './bubble-menu'
import { SlashCommand } from './slash-command'
import { QCMExtension } from './extensions/qcm-extension'
import { CodeBlockExtension } from './extensions/code-block-extension'

interface EditorProps {
  documentId: string
}

export function Editor({ documentId }: EditorProps) {
  const { updateDocument, documents } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const currentDoc = documents.find((doc) => doc.id === documentId)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // On utilise notre propre code block
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'Titre'
          }
          return 'Tapez "/" pour les commandes ou commencez à écrire...'
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      SlashCommand,
      QCMExtension,
      CodeBlockExtension,
    ],
    content: currentDoc?.content || { type: 'doc', content: [{ type: 'paragraph' }] },
    editorProps: {
      attributes: {
        class: 'ProseMirror focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      // Sauvegarder après 2 secondes d'inactivité
      debouncedSave(editor.getJSON())
    },
  })

  // Fonction de sauvegarde avec debounce
  const debouncedSave = debounce(async (content: any) => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { error } = await supabase
        .from('documents')
        .update({
          content,
          updated_at: new Date().toISOString(),
          last_edited_by: user.id,
        })
        .eq('id', documentId)

      if (error) throw error

      updateDocument(documentId, { content })
    } catch (error) {
      console.error('Error saving document:', error)
    }
  }, 2000)

  // Charger le document au montage
  useEffect(() => {
    const loadDocument = async () => {
      if (!editor || !documentId) return

      setIsLoading(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('id', documentId)
          .single()

        if (error) throw error

        if (data) {
          editor.commands.setContent(data.content || { type: 'doc', content: [{ type: 'paragraph' }] })
        }
      } catch (error) {
        console.error('Error loading document:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDocument()
  }, [editor, documentId])

  // Mettre à jour le titre du document si la première ligne est un heading
  useEffect(() => {
    if (!editor) return

    const updateTitle = () => {
      const firstNode = editor.state.doc.firstChild
      if (firstNode && firstNode.type.name === 'heading') {
        const title = firstNode.textContent
        if (title && title !== currentDoc?.title) {
          updateDocument(documentId, { title })
          
          // Sauvegarder dans Supabase
          const supabase = createClient()
          supabase
            .from('documents')
            .update({ title })
            .eq('id', documentId)
            .then(({ error }) => {
              if (error) console.error('Error updating title:', error)
            })
        }
      }
    }

    editor.on('update', updateTitle)

    return () => {
      editor.off('update', updateTitle)
    }
  }, [editor, documentId, currentDoc?.title, updateDocument])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!editor) {
    return null
  }

  return (
    <div className="relative h-full">
      {/* Bubble Menu pour la sélection de texte */}
      <BubbleMenu editor={editor} />

      {/* Éditeur principal */}
      <EditorContent editor={editor} className="h-full" />
    </div>
  )
}
