'use client'

import { useStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  Sun,
  Moon,
  MoreVertical,
  Share2,
  MessageSquare,
  Clock,
  LogOut,
  User,
  Settings,
} from 'lucide-react'
import { useState } from 'react'
import { cn, getInitials, stringToColor } from '@/lib/utils'

export function Header() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { user, documents, currentDocumentId, setShareModalOpen, setCommentsOpen, commentsOpen } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)

  const currentDocument = documents.find((doc) => doc.id === currentDocumentId)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 gap-4">
      {/* Breadcrumb / Document Title */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {currentDocument ? (
          <>
            <span className="text-2xl">{currentDocument.icon}</span>
            <h1 className="text-sm font-medium truncate">
              {currentDocument.title}
            </h1>
          </>
        ) : (
          <h1 className="text-sm font-medium text-muted-foreground">
            DocPro Elite
          </h1>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* History Button */}
        {currentDocument && (
          <button
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title="Historique des versions"
          >
            <Clock className="h-5 w-5" />
          </button>
        )}

        {/* Comments Toggle */}
        {currentDocument && (
          <button
            className={cn(
              'p-2 hover:bg-accent rounded-lg transition-colors',
              commentsOpen && 'bg-accent'
            )}
            onClick={() => setCommentsOpen(!commentsOpen)}
            title="Commentaires"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
        )}

        {/* Share Button */}
        {currentDocument && (
          <button
            className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            onClick={() => setShareModalOpen(true)}
          >
            <Share2 className="h-4 w-4" />
            Partager
          </button>
        )}

        {/* Theme Toggle */}
        <button
          className="p-2 hover:bg-accent rounded-lg transition-colors"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            className="flex items-center gap-2 p-1 hover:bg-accent rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name || 'User'}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium',
                  stringToColor(user?.email || '')
                )}
              >
                {getInitials(user?.full_name || user?.email || 'U')}
              </div>
            )}
            <MoreVertical className="h-4 w-4" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-xl py-2 z-20 animate-slide-in">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium">{user?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>

                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors"
                  onClick={() => {
                    setMenuOpen(false)
                    // TODO: Navigate to profile
                  }}
                >
                  <User className="h-4 w-4" />
                  Profil
                </button>

                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors"
                  onClick={() => {
                    setMenuOpen(false)
                    // TODO: Navigate to settings
                  }}
                >
                  <Settings className="h-4 w-4" />
                  Paramètres
                </button>

                <div className="border-t border-border my-2" />

                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors"
                  onClick={() => {
                    setMenuOpen(false)
                    handleSignOut()
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
