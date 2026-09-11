import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Sale from './pages/Sale'
import Inventory from './pages/Inventory'
import Suppliers from './pages/Suppliers'
import History from './pages/History'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import { AuthProvider, useAuth } from './auth/AuthContext'
import { AppDataProvider } from './data/AppDataContext'

function RequireAuth({ children }) {
  const { isAuthed, checking } = useAuth()
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-text">
        <span className="font-mono text-[14px] text-text-warm">...</span>
      </div>
    )
  }
  return isAuthed ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
            <RequireAuth>
                <AppDataProvider><Layout /></AppDataProvider>
              </RequireAuth>
            }
          >
            <Route index element={<Sale />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="history" element={<History />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
