'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/lib/store'
import { X, Send, Trash2, Check } from 'lucide-react'
import { formatRelativeTime, getInitials, stringToColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Comment {
  id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  user?: {
    full_name: string
    avatar_url: string | null
    email: string
  }
  replies?: Comment[]
}

export function CommentsPanel({ documentId }: { documentId: string }) {
  const { user } = useStore()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Charger les commentaires
  useEffect(() => {
    loadComments()
    
    // S'abonner aux changements en temps réel
    const supabase = createClient()
    const channel = supabase
      .channel(`comments:${documentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `document_id=eq.${documentId}`,
        },
        () => {
          loadComments()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [documentId])

  const loadComments = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('comments')
        .select(
          `
          *,
          user:profiles(full_name, avatar_url, email)
        `
        )
        .eq('document_id', documentId)
        .is('parent_id', null)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Charger les réponses
      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: replies } = await supabase
            .from('comments')
            .select(
              `
              *,
              user:profiles(full_name, avatar_url, email)
            `
            )
            .eq('parent_id', comment.id)
            .order('created_at', { ascending: true })

          return {
            ...comment,
            replies: replies || [],
          }
        })
      )

      setComments(commentsWithReplies)
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('comments').insert({
        document_id: documentId,
        user_id: user.id,
        content: newComment,
      })

      if (error) throw error

      setNewComment('')
      loadComments()
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim() || !user) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('comments').insert({
        document_id: documentId,
        user_id: user.id,
        content: replyContent,
        parent_id: parentId,
      })

      if (error) throw error

      setReplyContent('')
      setReplyTo(null)
      loadComments()
    } catch (error) {
      console.error('Error replying to comment:', error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error

      loadComments()
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const renderComment = (comment: Comment, isReply: boolean = false) => {
    const commentUser = comment.user || {
      full_name: 'Utilisateur',
      avatar_url: null,
      email: '',
    }

    return (
      <div
        key={comment.id}
        className={cn('space-y-2', isReply && 'ml-8 mt-2')}
      >
        <div className="flex gap-3">
          {/* Avatar */}
          {commentUser.avatar_url ? (
            <img
              src={commentUser.avatar_url}
              alt={commentUser.full_name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div
              className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-medium',
                stringToColor(commentUser.email)
              )}
            >
              {getInitials(commentUser.full_name)}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {commentUser.full_name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(comment.created_at)}
              </span>
            </div>

            <p className="text-sm text-foreground">{comment.content}</p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setReplyTo(comment.id)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Répondre
              </button>
              {comment.user_id === user?.id && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  Supprimer
                </button>
              )}
            </div>

            {/* Reply Input */}
            {replyTo === comment.id && (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleReply(comment.id)
                    }
                    if (e.key === 'Escape') {
                      setReplyTo(null)
                      setReplyContent('')
                    }
                  }}
                  placeholder="Écrire une réponse..."
                  className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
                <button
                  onClick={() => handleReply(comment.id)}
                  className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-2">
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-96 bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Commentaires</h2>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            Aucun commentaire
          </div>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>

      {/* New Comment Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddComment()
              }
            }}
            placeholder="Ajouter un commentaire..."
            className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
