import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Sale from './pages/Sale'
import Inventory from './pages/Inventory'
import Suppliers from './pages/Suppliers'
import History from './pages/History'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Sale />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="history" element={<History />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
