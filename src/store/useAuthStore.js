import { create } from 'zustand'
import { AUTH_TOKEN_KEY } from '../lib/constants.js'

const useAuthStore = create((set) => ({
  token:         localStorage.getItem(AUTH_TOKEN_KEY) || null,
  isAuthenticated: !!localStorage.getItem(AUTH_TOKEN_KEY),
  user:          localStorage.getItem(AUTH_TOKEN_KEY) ? { username: 'admin', role: 'admin' } : null,

  login: (username, password) => {
    // Mock authentication — accepts admin/admin in dev
    if (username === 'admin' && password === 'admin') {
      const token = 'mock-jwt-token-skylink'
      localStorage.setItem(AUTH_TOKEN_KEY, token)
      set({ token, isAuthenticated: true, user: { username, role: 'admin' } })
      return { ok: true }
    }
    return { ok: false, error: 'Invalid credentials' }
  },

  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    set({ token: null, isAuthenticated: false, user: null })
  },
}))

export default useAuthStore
