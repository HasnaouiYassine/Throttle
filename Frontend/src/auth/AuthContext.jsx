import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const STORAGE_KEY = 'throttle-token'

const readToken = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || null
  } catch {
    return null
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [checking, setChecking] = useState(true)

  // Validate any saved token on boot (tokens expire after 7 days)
  useEffect(() => {
    const saved = readToken()
    if (!saved) {
      setChecking(false)
      return
    }
    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${saved}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('invalid token')
        return res.json()
      })
      .then((data) => {
        setUser(data.username)
        setToken(saved)
      })
      .catch(() => {
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch {
          // ignore
        }
      })
      .finally(() => setChecking(false))
  }, [])

  const login = useCallback(async (username, password) => {
    let res
    try {
      res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
    } catch {
      return { ok: false, code: 'NETWORK' }
    }
    if (!res.ok) {
      return { ok: false, code: res.status === 401 ? 'INVALID' : 'SERVER' }
    }
    const data = await res.json()
    try {
      localStorage.setItem(STORAGE_KEY, data.token)
    } catch {
      // storage unavailable — session still works in memory
    }
    setToken(data.token)
    setUser(data.username)
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isAuthed: !!user, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
