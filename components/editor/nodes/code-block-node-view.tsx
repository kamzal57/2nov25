'use client'

import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { getHighlighter } from 'shiki'

const LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'csharp',
  'php',
  'ruby',
  'go',
  'rust',
  'cpp',
  'html',
  'css',
  'json',
  'sql',
  'bash',
]

export function CodeBlockNodeView({ node, updateAttributes, deleteNode }: any) {
  const { language } = node.attrs
  const [highlightedCode, setHighlightedCode] = useState<string>('')
  const [isHighlighting, setIsHighlighting] = useState(false)

  // Mise à jour de la coloration syntaxique
  useEffect(() => {
    const highlightCode = async () => {
      if (!node.textContent) {
        setHighlightedCode('')
        return
      }

      setIsHighlighting(true)
      try {
        const highlighter = await getHighlighter({
          themes: ['github-dark', 'github-light'],
          langs: LANGUAGES,
        })

        const html = highlighter.codeToHtml(node.textContent, {
          lang: language || 'javascript',
          theme: 'github-dark', // Vous pouvez basculer selon le thème
        })

        setHighlightedCode(html)
      } catch (error) {
        console.error('Error highlighting code:', error)
        setHighlightedCode('')
      } finally {
        setIsHighlighting(false)
      }
    }

    highlightCode()
  }, [node.textContent, language])

  return (
    <NodeViewWrapper className="code-block-node">
      <div className="flex items-center justify-between mb-2">
        <select
          value={language}
          onChange={(e) => updateAttributes({ language: e.target.value })}
          className="px-2 py-1 bg-background border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        <button
          onClick={deleteNode}
          className="p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
          title="Supprimer le bloc de code"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      <div className="relative">
        {/* Éditeur de code (invisible mais éditable) */}
        <NodeViewContent
          as="pre"
          className="absolute inset-0 opacity-0 font-mono text-sm p-4 focus:opacity-100 focus:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring rounded"
        >
          <code></code>
        </NodeViewContent>

        {/* Code coloré (affiché) */}
        {!isHighlighting && highlightedCode ? (
          <div
            className="font-mono text-sm p-4 overflow-x-auto pointer-events-none"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        ) : (
          <pre className="font-mono text-sm p-4 overflow-x-auto">
            <code>{node.textContent || ' '}</code>
          </pre>
        )}
      </div>

      <div className="mt-2 text-xs text-muted-foreground">
        Cliquez pour éditer • {language}
      </div>
    </NodeViewWrapper>
  )
}
