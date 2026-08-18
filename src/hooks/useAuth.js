import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore.js'

export function useAuth() {
  const navigate  = useNavigate()
  const store     = useAuthStore()

  const login = (username, password) => {
    const result = store.login(username, password)
    if (result.ok) navigate('/admin')
    return result
  }

  const logout = () => {
    store.logout()
    navigate('/login')
  }

  return {
    isAuthenticated: store.isAuthenticated,
    user:            store.user,
    login,
    logout,
  }
}
