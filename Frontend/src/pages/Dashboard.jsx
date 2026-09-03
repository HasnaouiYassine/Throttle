import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { sales, items, revenueTrend, heatmapData, topSellers, slowMovers } from '../data/mockData'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getIntensityClass(value) {
  if (value <= 2) return 'bg-surface-variant'
  if (value <= 4) return 'bg-accent-container/30'
  if (value <= 6) return 'bg-accent-container/60'
  if (value <= 8) return 'bg-accent-container/90'
  return 'bg-accent border border-text'
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border-warm p-2">
        <p className="font-mono text-[12px] text-text-muted">{label}</p>
        <p className="font-mono text-[14px] text-text font-bold">{payload[0].value} DT</p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const totalRevenue = useMemo(() => sales.reduce((sum, s) => sum + s.total, 0), [])

  const avgTicket = useMemo(() => {
    if (sales.length === 0) return 0
    return Math.round(totalRevenue / sales.length)
  }, [totalRevenue])

  const totalCost = useMemo(() => {
    return sales.reduce((sum, s) =>
      sum + s.lines.reduce((lsum, l) => {
        const item = items.find(it => it.id === l.itemId)
        return lsum + (item?.cost ?? 0) * l.qty
      }, 0),
    0)
  }, [])

  const margin = totalRevenue - totalCost
  const marginPct = totalRevenue > 0 ? ((margin / totalRevenue) * 100).toFixed(1) : '0.0'

  return (
    <div className="flex flex-col min-h-full lg:h-full lg:overflow-auto">
      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 sm:p-6 sm:pb-4">
        {/* Total Revenue */}
        <div className="bg-surface border border-border-warm p-4 flex flex-col">
          <span className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm mb-2">
            Total Revenue
          </span>
          <span className="font-sans text-3xl sm:text-[36px] xl:text-[48px] font-bold leading-tight sm:leading-[56px] tracking-tight text-text">
            {totalRevenue.toLocaleString()} DT
          </span>
          <span className="font-mono text-[14px] text-accent-light flex items-center gap-1 mt-2">
            <TrendingUp size={14} /> +12.5% vs Last Week
          </span>
        </div>

        {/* Avg Transaction */}
        <div className="bg-surface border border-border-warm p-4 flex flex-col">
          <span className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm mb-2">
            Avg Transaction Value
          </span>
          <span className="font-sans text-3xl sm:text-[36px] xl:text-[48px] font-bold leading-tight sm:leading-[56px] tracking-tight text-text">
            {avgTicket} DT
          </span>
          <span className="font-mono text-[14px] text-text-warm flex items-center gap-1 mt-2">
            <ArrowRight size={14} /> 0.0% vs Last Week
          </span>
        </div>

        {/* Gross Profit Margin */}
        <div className="bg-surface border border-border-warm p-4 flex flex-col">
          <span className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm mb-2">
            Gross Profit Margin
          </span>
          <span className="font-sans text-3xl sm:text-[36px] xl:text-[48px] font-bold leading-tight sm:leading-[56px] tracking-tight text-text">
            {marginPct}%
          </span>
          <span className="font-mono text-[14px] text-danger flex items-center gap-1 mt-2">
            <TrendingDown size={14} /> -2.1% vs Last Week
          </span>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 sm:px-6 pb-6 flex-1 min-h-0">
        {/* LEFT: Charts */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Revenue Trend */}
          <div className="bg-surface border border-border-warm p-4 h-64 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm">
                Revenue Trend (30 Days)
              </span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span className="font-mono text-[12px] text-text-muted">Gross</span>
              </div>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ff6b00" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#5a4136" vertical={false} />
                  <XAxis dataKey="day" stroke="#5c616c" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#5c616c" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#ff5a1f" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Peak Activity Heatmap */}
          <div className="bg-surface border border-border-warm p-4 flex-1 flex flex-col min-h-[280px]">
            <span className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-text-warm mb-4">
              Peak Activity (Heatmap)
            </span>
            <div className="flex-1 overflow-x-auto">
              <div className="grid grid-cols-8 gap-1 h-full min-w-[480px]">
                {/* Rows: each time slot */}
                {heatmapData.map((row) => (
                  <div key={row.time} className="contents">
                    {/* Time label */}
                    <div className="font-mono text-[12px] text-text-muted flex items-center justify-end pr-2">
                      {row.time}
                    </div>
                    {/* Day cells */}
                    {days.map((day) => (
                      <div key={`${row.time}-${day}`} className="p-[1px]">
                        <div className={`w-full h-8 ${getIntensityClass(row[day])} transition-colors`} />
                      </div>
                    ))}
                  </div>
                ))}
                {/* Day labels row */}
                <div /> {/* empty cell under time labels */}
                {days.map((day) => (
                  <div
                    key={`label-${day}`}
                    className={`font-mono text-[12px] font-bold tracking-[0.1em] text-center uppercase pt-2 ${
                      day === 'Sat' ? 'text-accent-light' : 'text-text-muted'
                    }`}
                  >
                    {day.toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Lists */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Top 5 Best-Sellers */}
          <div className="bg-surface border border-border-warm p-4 flex-1 lg:overflow-auto">
            <span className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-accent-light mb-4 block">
              Top 5 Best-Sellers (MTD)
            </span>
            <div className="flex flex-col gap-3">
              {topSellers.map((item, idx) => (
                <div
                  key={item.sku}
                  className={`flex justify-between items-center pb-2 ${idx < topSellers.length - 1 ? 'border-b border-surface-variant' : ''}`}
                >
                  <div>
                    <span className="font-sans text-[16px] text-text block">{item.name}</span>
                    <span className="font-mono text-xs text-text-warm">SKU: {item.sku}</span>
                  </div>
                  <span className="font-mono text-[14px] font-bold text-text">{item.sold}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top 5 Slow-Movers */}
          <div className="bg-surface border border-border-warm p-4 flex-1 lg:overflow-auto">
            <span className="font-mono text-[12px] font-bold tracking-[0.1em] uppercase text-danger mb-4 block">
              Top 5 Slow-Movers
            </span>
            <div className="flex flex-col gap-3">
              {slowMovers.map((item, idx) => (
                <div
                  key={item.sku}
                  className={`flex justify-between items-center pb-2 ${idx < slowMovers.length - 1 ? 'border-b border-surface-variant' : ''}`}
                >
                  <div>
                    <span className="font-sans text-[16px] text-text block">{item.name}</span>
                    <span className="font-mono text-xs text-text-warm">SKU: {item.sku}</span>
                  </div>
                  <span className="font-mono text-[14px] font-bold text-text">{item.sold}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
