'use client'

import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react'
import type { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Highlighter,
  Palette,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface BubbleMenuProps {
  editor: Editor
}

export function BubbleMenu({ editor }: BubbleMenuProps) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showColorPicker, setShowColorPicker] = useState(false)

  const colors = [
    '#000000',
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
  ]

  const handleSetLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run()
      setShowLinkInput(false)
      setLinkUrl('')
    } else {
      editor.chain().focus().unsetLink().run()
      setShowLinkInput(false)
    }
  }

  return (
    <TiptapBubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="bubble-menu"
    >
      {showLinkInput ? (
        <div className="flex items-center gap-2 p-2">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSetLink()
              }
              if (e.key === 'Escape') {
                setShowLinkInput(false)
                setLinkUrl('')
              }
            }}
            placeholder="https://example.com"
            className="px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            autoFocus
          />
          <button
            onClick={handleSetLink}
            className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded hover:opacity-90"
          >
            OK
          </button>
        </div>
      ) : showColorPicker ? (
        <div className="flex items-center gap-1 p-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => {
                editor.chain().focus().setColor(color).run()
                setShowColorPicker(false)
              }}
              className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
          <button
            onClick={() => {
              editor.chain().focus().unsetColor().run()
              setShowColorPicker(false)
            }}
            className="px-2 py-1 text-xs bg-background border border-border rounded hover:bg-accent ml-1"
          >
            Réinitialiser
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              'p-2 rounded hover:bg-accent',
              editor.isActive('bold') && 'is-active bg-accent'
            )}
            title="Gras (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              'p-2 rounded hover:bg-accent',
              editor.isActive('italic') && 'is-active bg-accent'
            )}
            title="Italique (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn(
              'p-2 rounded hover:bg-accent',
              editor.isActive('strike') && 'is-active bg-accent'
            )}
            title="Barré"
          >
            <Strikethrough className="h-4 w-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={cn(
              'p-2 rounded hover:bg-accent',
              editor.isActive('code') && 'is-active bg-accent'
            )}
            title="Code"
          >
            <Code className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-border mx-1" />

          <button
            onClick={() => {
              const previousUrl = editor.getAttributes('link').href
              setLinkUrl(previousUrl || '')
              setShowLinkInput(true)
            }}
            className={cn(
              'p-2 rounded hover:bg-accent',
              editor.isActive('link') && 'is-active bg-accent'
            )}
            title="Lien"
          >
            <LinkIcon className="h-4 w-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={cn(
              'p-2 rounded hover:bg-accent',
              editor.isActive('highlight') && 'is-active bg-accent'
            )}
            title="Surligner"
          >
            <Highlighter className="h-4 w-4" />
          </button>

          <button
            onClick={() => setShowColorPicker(true)}
            className="p-2 rounded hover:bg-accent"
            title="Couleur du texte"
          >
            <Palette className="h-4 w-4" />
          </button>
        </>
      )}
    </TiptapBubbleMenu>
  )
}
