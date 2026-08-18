import { create } from 'zustand'
import { mockFileShares, mockFileBrowse } from '../lib/mockData.js'

const useFilesStore = create((set, get) => ({
  shares:  mockFileShares.map(s => ({ ...s })),
  files:   mockFileBrowse,
  currentShare: null,
  currentPath: '/',
  loading: false,

  addShare: (share) => {
    set({ shares: [...get().shares, { ...share, files: 0 }] })
  },

  removeShare: (name) => {
    set({ shares: get().shares.filter(s => s.name !== name) })
  },

  updateShare: (name, updates) => {
    set({ shares: get().shares.map(s => s.name === name ? { ...s, ...updates } : s) })
  },

  browse: (shareName, path) => {
    set({ currentShare: shareName, currentPath: path, files: mockFileBrowse })
  },
}))

export default useFilesStore
