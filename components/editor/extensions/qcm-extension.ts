import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { QCMNodeView } from '../nodes/qcm-node-view'

export interface QCMOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface QCMAttributes {
  question: string
  options: QCMOption[]
}

/**
 * Extension Tiptap pour les QCM (Questionnaire à Choix Multiples)
 */
export const QCMExtension = Node.create({
  name: 'qcm',

  group: 'block',

  content: 'inline*',

  atom: true,

  addAttributes() {
    return {
      question: {
        default: 'Votre question ici',
      },
      options: {
        default: [
          { id: '1', text: 'Option 1', isCorrect: false },
          { id: '2', text: 'Option 2', isCorrect: true },
          { id: '3', text: 'Option 3', isCorrect: false },
        ],
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="qcm"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'qcm' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(QCMNodeView)
  },
})
