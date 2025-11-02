'use client'

import { useState, useRef, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import {
  File,
  Folder,
  FolderOpen,
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Edit2,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface FolderTreeItem {
  id: string
  name: string
  type: 'folder' | 'document'
  children?: FolderTreeItem[]
  parentId?: string | null
  icon?: string
}

export function Sidebar() {
  const router = useRouter()
  const {
    folders,
    documents,
    sidebarWidth,
    setSidebarWidth,
    currentDocumentId,
    addDocument,
    addFolder,
    deleteDocument,
    deleteFolder,
  } = useStore()

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Gestion du redimensionnement
  const handleMouseDown = () => {
    setIsResizing(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const newWidth = Math.max(200, Math.min(500, e.clientX))
      setSidebarWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, setSidebarWidth])

  // Créer un nouveau document
  const handleCreateDocument = async (folderId?: string) => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from('documents')
        .insert({
          title: 'Sans titre',
          owner_id: user.id,
          folder_id: folderId || null,
        })
        .select()
        .single()

      if (error) throw error

      addDocument(data)
      router.push(`/app/documents/${data.id}`)
    } catch (error) {
      console.error('Error creating document:', error)
    }
  }

  // Créer un nouveau dossier
  const handleCreateFolder = async (parentId?: string) => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from('folders')
        .insert({
          name: 'Nouveau dossier',
          owner_id: user.id,
          parent_id: parentId || null,
        })
        .select()
        .single()

      if (error) throw error

      addFolder(data)
    } catch (error) {
      console.error('Error creating folder:', error)
    }
  }

  // Toggle folder
  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  // Construire l'arbre de dossiers
  const buildTree = (): FolderTreeItem[] => {
    const tree: FolderTreeItem[] = []
    const folderMap = new Map<string, FolderTreeItem>()

    // Créer les noeuds de dossiers
    folders.forEach((folder) => {
      folderMap.set(folder.id, {
        id: folder.id,
        name: folder.name,
        type: 'folder',
        children: [],
        parentId: folder.parent_id,
      })
    })

    // Organiser la hiérarchie
    folders.forEach((folder) => {
      const node = folderMap.get(folder.id)!
      if (folder.parent_id) {
        const parent = folderMap.get(folder.parent_id)
        parent?.children?.push(node)
      } else {
        tree.push(node)
      }
    })

    // Ajouter les documents
    documents.forEach((doc) => {
      const docNode: FolderTreeItem = {
        id: doc.id,
        name: doc.title,
        type: 'document',
        icon: doc.icon,
      }

      if (doc.folder_id) {
        const parent = folderMap.get(doc.folder_id)
        parent?.children?.push(docNode)
      } else {
        tree.push(docNode)
      }
    })

    return tree
  }

  // Render tree item
  const renderTreeItem = (item: FolderTreeItem, level: number = 0) => {
    const isExpanded = expandedFolders.has(item.id)
    const isActive = item.type === 'document' && item.id === currentDocumentId

    return (
      <div key={item.id}>
        <div
          className={cn(
            'flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors group',
            'hover:bg-accent',
            isActive && 'bg-accent text-accent-foreground'
          )}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => {
            if (item.type === 'folder') {
              toggleFolder(item.id)
            } else {
              router.push(`/app/documents/${item.id}`)
            }
          }}
        >
          {item.type === 'folder' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFolder(item.id)
              }}
              className="flex items-center"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}

          {item.type === 'folder' ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4 text-primary" />
            ) : (
              <Folder className="h-4 w-4 text-primary" />
            )
          ) : (
            <span className="text-lg">{item.icon || '📄'}</span>
          )}

          <span className="flex-1 text-sm truncate">{item.name}</span>

          <button
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-background rounded transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>

        {item.type === 'folder' &&
          isExpanded &&
          item.children?.map((child) => renderTreeItem(child, level + 1))}
      </div>
    )
  }

  const tree = buildTree()

  return (
    <>
      <div
        ref={sidebarRef}
        className="fixed left-0 top-0 h-full bg-card border-r border-border flex flex-col z-10"
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold text-gradient">DocPro Elite</h1>
        </div>

        {/* Search */}
        <div className="p-4">
          <button
            className="w-full flex items-center gap-2 px-3 py-2 bg-accent rounded-lg text-sm text-muted-foreground hover:bg-accent/80 transition-colors"
            onClick={() => {
              // TODO: Ouvrir le modal de recherche
            }}
          >
            <Search className="h-4 w-4" />
            <span>Rechercher...</span>
            <kbd className="ml-auto px-2 py-0.5 bg-background rounded text-xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Actions */}
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={() => handleCreateDocument()}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Nouveau
          </button>
          <button
            onClick={() => handleCreateFolder()}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <Folder className="h-4 w-4" />
          </button>
        </div>

        {/* Tree */}
        <div className="flex-1 overflow-y-auto px-2 scrollbar-thin">
          {tree.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              Aucun document
            </div>
          ) : (
            tree.map((item) => renderTreeItem(item))
          )}
        </div>
      </div>

      {/* Resizer */}
      <div
        className="fixed top-0 h-full w-1 cursor-col-resize hover:bg-primary/20 active:bg-primary/40 transition-colors z-20"
        style={{ left: `${sidebarWidth}px` }}
        onMouseDown={handleMouseDown}
      />
    </>
  )
}
