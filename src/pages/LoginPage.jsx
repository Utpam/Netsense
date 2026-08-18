import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Radio, Eye, EyeOff, AlertCircle } from 'lucide-react'
import useAuthStore from '../store/useAuthStore.js'

export default function LoginPage() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const login    = useAuthStore(s => s.login)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))        // simulate latency
    const result = login(username, password)
    setLoading(false)
    if (result.ok) navigate('/admin')
    else setError(result.error)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-surface-0)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'var(--color-primary)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}>
            <Radio size={26} color="#000" />
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--color-text)' }}>SkyLink</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--color-text-muted)' }}>Administration Interface</p>
        </div>

        {/* Card */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="sl-field">
                <label className="sl-label" htmlFor="username">Username</label>
                <input
                  id="username"
                  className="sl-input"
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="sl-field">
                <label className="sl-label" htmlFor="password">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    className="sl-input"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ paddingRight: 38 }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                    }}
                  >
                    {showPass ? <EyeOff size={14} color="var(--color-text-muted)" /> : <Eye size={14} color="var(--color-text-muted)" />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  color: 'var(--color-danger)', fontSize: 13,
                  background: 'var(--color-danger-dim)', padding: '8px 12px', borderRadius: 6,
                }}>
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ justifyContent: 'center', padding: '9px 16px' }}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <div className="divider" />
            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center' }}>
              Not an admin?{' '}
              <a href="/client" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                Client view →
              </a>
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--color-text-dim)', marginTop: 20 }}>
          Default credentials: admin / admin
        </p>
      </div>
    </div>
  )
}
