'use client'

import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { useState } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { QCMOption } from '../extensions/qcm-extension'

export function QCMNodeView({ node, updateAttributes, deleteNode }: any) {
  const { question, options } = node.attrs
  const [isEditing, setIsEditing] = useState(false)

  const addOption = () => {
    const newOption: QCMOption = {
      id: Date.now().toString(),
      text: `Option ${options.length + 1}`,
      isCorrect: false,
    }
    updateAttributes({ options: [...options, newOption] })
  }

  const removeOption = (id: string) => {
    if (options.length <= 2) return // Minimum 2 options
    updateAttributes({
      options: options.filter((opt: QCMOption) => opt.id !== id),
    })
  }

  const toggleCorrect = (id: string) => {
    updateAttributes({
      options: options.map((opt: QCMOption) =>
        opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt
      ),
    })
  }

  const updateOptionText = (id: string, text: string) => {
    updateAttributes({
      options: options.map((opt: QCMOption) =>
        opt.id === id ? { ...opt, text } : opt
      ),
    })
  }

  const updateQuestion = (newQuestion: string) => {
    updateAttributes({ question: newQuestion })
  }

  return (
    <NodeViewWrapper className="qcm-node">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={question}
              onChange={(e) => updateQuestion(e.target.value)}
              onBlur={() => setIsEditing(false)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
          ) : (
            <h3
              onClick={() => setIsEditing(true)}
              className="text-lg font-semibold cursor-pointer hover:text-primary transition-colors"
            >
              {question}
            </h3>
          )}
        </div>
        <button
          onClick={deleteNode}
          className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
          title="Supprimer le QCM"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2">
        {options.map((option: QCMOption, index: number) => (
          <div
            key={option.id}
            className={cn(
              'qcm-option',
              option.isCorrect && 'qcm-option correct'
            )}
          >
            <span className="text-sm text-muted-foreground w-6">
              {String.fromCharCode(65 + index)}.
            </span>
            <input
              type="text"
              value={option.text}
              onChange={(e) => updateOptionText(option.id, e.target.value)}
              className="flex-1 bg-transparent border-none focus:outline-none"
            />
            <button
              onClick={() => toggleCorrect(option.id)}
              className={cn(
                'p-1 rounded transition-colors',
                option.isCorrect
                  ? 'bg-green-500 text-white'
                  : 'hover:bg-accent'
              )}
              title={option.isCorrect ? 'Réponse correcte' : 'Marquer comme correct'}
            >
              <Check className="h-4 w-4" />
            </button>
            {options.length > 2 && (
              <button
                onClick={() => removeOption(option.id)}
                className="p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                title="Supprimer l'option"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addOption}
        className="mt-4 flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
      >
        <Plus className="h-4 w-4" />
        Ajouter une option
      </button>
    </NodeViewWrapper>
  )
}
