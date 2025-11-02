import { create } from 'zustand'

interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
}

interface Document {
  id: string
  title: string
  content: string
  icon?: string
  user_id: string
  created_at: string
  updated_at: string
  folder_id?: string | null
}

interface Folder {
  id: string
  name: string
  parent_id?: string | null
  user_id: string
  created_at: string
}

interface DocumentStore {
  user: User | null
  documents: Document[]
  folders: Folder[]
  currentDocumentId: string | null
  commentsOpen: boolean
  shareModalOpen: boolean
  sidebarWidth: number
  setUser: (user: User | null) => void
  setDocuments: (documents: Document[]) => void
  setFolders: (folders: Folder[]) => void
  updateDocument: (id: string, updates: Partial<Document>) => void
  setCurrentDocumentId: (id: string | null) => void
  setCommentsOpen: (open: boolean) => void
  setShareModalOpen: (open: boolean) => void
  setSidebarWidth: (width: number) => void
  addDocument: (folderId?: string | null) => Promise<void>
  addFolder: (parentId?: string | null) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
  deleteFolder: (id: string) => Promise<void>
  fetchUserData: () => Promise<void>
  fetchDocumentsAndFolders: () => Promise<void>
}

export const useStore = create<DocumentStore>((set) => ({
  user: null,
  documents: [],
  folders: [],
  currentDocumentId: null,
  commentsOpen: false,
  shareModalOpen: false,
  sidebarWidth: 240,
  setUser: (user) => set({ user }),
  setDocuments: (documents) => set({ documents }),
  setFolders: (folders) => set({ folders }),
  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, ...updates } : doc
      ),
    })),
  setCurrentDocumentId: (id) => set({ currentDocumentId: id }),
  setCommentsOpen: (open) => set({ commentsOpen: open }),
  setShareModalOpen: (open) => set({ shareModalOpen: open }),
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
  addDocument: async (folderId) => {
    // Placeholder: implement document creation
  },
  addFolder: async (parentId) => {
    // Placeholder: implement folder creation
  },
  deleteDocument: async (id) => {
    // Placeholder: implement document deletion
  },
  deleteFolder: async (id) => {
    // Placeholder: implement folder deletion
  },
  fetchUserData: async () => {
    // Placeholder: implement user data fetching
  },
  fetchDocumentsAndFolders: async () => {
    // Placeholder: implement documents and folders fetching
  },
}))
