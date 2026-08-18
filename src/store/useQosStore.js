import { create } from 'zustand'
import { mockQosRules, mockQosStatus } from '../lib/mockData.js'

let nextId = mockQosRules.length + 1

const useQosStore = create((set, get) => ({
  rules:   mockQosRules.map(r => ({ ...r })),
  status:  { ...mockQosStatus },
  loading: false,
  applied: true,

  addRule: (rule) => {
    set({ rules: [...get().rules, { ...rule, id: nextId++, enabled: true }], applied: false })
  },

  updateRule: (id, updates) => {
    set({
      rules: get().rules.map(r => r.id === id ? { ...r, ...updates } : r),
      applied: false,
    })
  },

  deleteRule: (id) => {
    set({ rules: get().rules.filter(r => r.id !== id), applied: false })
  },

  toggleRule: (id) => {
    set({
      rules: get().rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r),
      applied: false,
    })
  },

  apply: () => set({ applied: true }),

  reset: () => set({ rules: [], applied: false }),
}))

export default useQosStore
