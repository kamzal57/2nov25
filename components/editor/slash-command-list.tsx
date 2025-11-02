'use client'

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { cn } from '@/lib/utils'

interface SlashCommandListProps {
  items: Array<{
    title: string
    description: string
    icon: string
    command: (args: any) => void
  }>
  command: (item: any) => void
}

export const SlashCommandList = forwardRef((props: SlashCommandListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index]
    if (item) {
      props.command(item)
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  return (
    <div className="slash-command-menu">
      {props.items.length > 0 ? (
        props.items.map((item, index) => (
          <button
            key={index}
            className={cn(
              'slash-command-item',
              index === selectedIndex && 'selected'
            )}
            onClick={() => selectItem(index)}
          >
            <span className="text-2xl">{item.icon}</span>
            <div className="flex flex-col items-start">
              <span className="font-medium">{item.title}</span>
              <span className="text-xs text-muted-foreground">
                {item.description}
              </span>
            </div>
          </button>
        ))
      ) : (
        <div className="px-3 py-2 text-sm text-muted-foreground">
          Aucune commande trouvée
        </div>
      )}
    </div>
  )
})

SlashCommandList.displayName = 'SlashCommandList'
