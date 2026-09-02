import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import { TrendingUp, DollarSign, Package, Clock } from 'lucide-react'
import { revenueTrend, peakHours, sales, items } from '../data/mockData'

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 flex items-start gap-3">
      <div className="bg-accent/15 text-accent rounded-md p-2">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-xl font-display mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0)
  const avgTicket = Math.round(totalRevenue / sales.length)
  const totalCost = sales.reduce(
    (sum, s) => sum + s.lines.reduce((lsum, l) => {
      const item = items.find((it) => it.id === l.itemId)
      return lsum + (item?.cost ?? 0) * l.qty
    }, 0),
    0
  )
  const margin = totalRevenue - totalCost

  const itemCounts = {}
  sales.forEach((s) => s.lines.forEach((l) => {
    itemCounts[l.itemId] = (itemCounts[l.itemId] || 0) + l.qty
  }))
  const topItemId = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const topItem = items.find((it) => it.id === Number(topItemId))

  return (
    <div className="p-8 max-w-6xl">
      <h2 className="text-2xl mb-6">Dashboard</h2>

      <div className="grid grid-cols-4 gap-3 mb-8">
        <Stat icon={DollarSign} label="Revenue (period)" value={`${totalRevenue} DT`} />
        <Stat icon={TrendingUp} label="Profit margin" value={`${margin} DT`} />
        <Stat icon={Package} label="Top item" value={topItem?.name ?? '—'} />
        <Stat icon={Clock} label="Avg. transaction" value={`${avgTicket} DT`} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface border border-border rounded-lg p-5">
          <h3 className="text-sm font-medium text-text-muted mb-4">Revenue this week</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueTrend}>
              <CartesianGrid stroke="#2e3138" vertical={false} />
              <XAxis dataKey="day" stroke="#5c616c" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#5c616c" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#1b1d22', border: '1px solid #2e3138', borderRadius: 6 }} />
              <Line type="monotone" dataKey="revenue" stroke="#ff5a1f" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface border border-border rounded-lg p-5">
          <h3 className="text-sm font-medium text-text-muted mb-4">Peak hours</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={peakHours}>
              <CartesianGrid stroke="#2e3138" vertical={false} />
              <XAxis dataKey="hour" stroke="#5c616c" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#5c616c" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#1b1d22', border: '1px solid #2e3138', borderRadius: 6 }} />
              <Bar dataKey="sales" fill="#ff5a1f" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
