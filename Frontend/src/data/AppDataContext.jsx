import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const AppDataContext = createContext(null)

async function parseResponse(response) {
  if (response.status === 204) return null
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || 'REQUEST_FAILED')
  return body
}

export function AppDataProvider({ children }) {
  const { token } = useAuth()
  const [data, setData] = useState({ items: [], suppliers: [], orders: [], sales: [], dashboard: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const request = useCallback(async (path, options = {}) => {
    const response = await fetch(`${API_URL}/api${path}`, {
      ...options,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(options.headers || {}) },
    })
    return parseResponse(response)
  }, [token])

  const refresh = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const [items, suppliers, orders, sales, dashboard] = await Promise.all([
        request('/items'), request('/suppliers'), request('/orders'), request('/sales'), request('/dashboard'),
      ])
      setData({ items, suppliers, orders, sales, dashboard })
    } catch (reason) {
      setError(reason.message || 'Unable to load data')
    } finally {
      setLoading(false)
    }
  }, [request, token])

  useEffect(() => { refresh() }, [refresh])

  const mutate = useCallback(async (path, options) => {
    const result = await request(path, options)
    await refresh()
    return result
  }, [request, refresh])

  const value = {
    ...data, loading, error, refresh,
    createItem: (body) => mutate('/items', { method: 'POST', body: JSON.stringify(body) }),
    updateItem: (id, body) => mutate(`/items/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    deleteItem: (id) => mutate(`/items/${id}`, { method: 'DELETE' }),
    createSupplier: (body) => mutate('/suppliers', { method: 'POST', body: JSON.stringify(body) }),
    updateSupplier: (id, body) => mutate(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    deleteSupplier: (id) => mutate(`/suppliers/${id}`, { method: 'DELETE' }),
    createOrder: (body) => mutate('/orders', { method: 'POST', body: JSON.stringify(body) }),
    updateOrderStatus: (id, status) => mutate(`/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    deleteOrder: (id) => mutate(`/orders/${id}`, { method: 'DELETE' }),
    createSale: (body) => mutate('/sales', { method: 'POST', body: JSON.stringify(body) }),
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const context = useContext(AppDataContext)
  if (!context) throw new Error('useAppData must be used inside AppDataProvider')
  return context
}
