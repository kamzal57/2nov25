import { create } from 'zustand'

interface Document {
  id: string
  title: string
  content: string
  user_id: string
  created_at: string
  updated_at: string
}

interface DocumentStore {
  documents: Document[]
  setDocuments: (documents: Document[]) => void
  updateDocument: (id: string, updates: Partial<Document>) => void
}

export const useStore = create<DocumentStore>((set) => ({
  documents: [],
  setDocuments: (documents) => set({ documents }),
  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, ...updates } : doc
      ),
    })),
}))
