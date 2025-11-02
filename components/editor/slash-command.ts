import { Extension } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import { PluginKey } from '@tiptap/pm/state'
import Suggestion from '@tiptap/suggestion'
import { SlashCommandList } from './slash-command-list'
import tippy from 'tippy.js'

/**
 * Extension Slash Command pour Tiptap
 * Permet d'insérer rapidement des blocs en tapant "/"
 */
export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        pluginKey: new PluginKey('slashCommand'),
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range })
        },
        items: ({ query }: { query: string }) => {
          const commands = [
            {
              title: 'Titre 1',
              description: 'Grand titre de section',
              icon: '📌',
              command: ({ editor, range }: any) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode('heading', { level: 1 })
                  .run()
              },
            },
            {
              title: 'Titre 2',
              description: 'Titre de sous-section',
              icon: '📍',
              command: ({ editor, range }: any) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode('heading', { level: 2 })
                  .run()
              },
            },
            {
              title: 'Titre 3',
              description: 'Petit titre',
              icon: '📎',
              command: ({ editor, range }: any) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode('heading', { level: 3 })
                  .run()
              },
            },
            {
              title: 'Liste à puces',
              description: 'Créer une liste simple',
              icon: '•',
              command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).toggleBulletList().run()
              },
            },
            {
              title: 'Liste numérotée',
              description: 'Créer une liste ordonnée',
              icon: '1.',
              command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).toggleOrderedList().run()
              },
            },
            {
              title: 'Liste de tâches',
              description: 'Créer une checklist',
              icon: '☑',
              command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).toggleTaskList().run()
              },
            },
            {
              title: 'Citation',
              description: 'Créer une citation',
              icon: '💬',
              command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).toggleBlockquote().run()
              },
            },
            {
              title: 'Bloc de code',
              description: 'Insérer un bloc de code avec coloration',
              icon: '</>'  ,
              command: ({ editor, range }: any) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .insertContent({
                    type: 'codeBlock',
                    attrs: { language: 'javascript' },
                  })
                  .run()
              },
            },
            {
              title: 'Tableau',
              description: 'Insérer un tableau',
              icon: '⊞',
              command: ({ editor, range }: any) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run()
              },
            },
            {
              title: 'QCM',
              description: 'Créer un questionnaire à choix multiples',
              icon: '☐',
              command: ({ editor, range }: any) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .insertContent({
                    type: 'qcm',
                    attrs: {
                      question: 'Votre question ici',
                      options: [
                        { id: '1', text: 'Option 1', isCorrect: false },
                        { id: '2', text: 'Option 2', isCorrect: true },
                        { id: '3', text: 'Option 3', isCorrect: false },
                      ],
                    },
                  })
                  .run()
              },
            },
            {
              title: 'Séparateur',
              description: 'Insérer une ligne de séparation',
              icon: '—',
              command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).setHorizontalRule().run()
              },
            },
          ]

          return commands.filter((command) =>
            command.title.toLowerCase().includes(query.toLowerCase())
          )
        },
        render: () => {
          let component: ReactRenderer
          let popup: any

          return {
            onStart: (props: any) => {
              component = new ReactRenderer(SlashCommandList, {
                props,
                editor: props.editor,
              })

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              })
            },
            onUpdate(props: any) {
              component.updateProps(props)

              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              })
            },
            onKeyDown(props: any) {
              if (props.event.key === 'Escape') {
                popup[0].hide()
                return true
              }

              return (component.ref as any)?.onKeyDown?.(props)
            },
            onExit() {
              popup[0].destroy()
              component.destroy()
            },
          }
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})
