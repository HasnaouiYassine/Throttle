import { Router } from 'express'
import { readStore } from '../store.js'

const router = Router()
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

router.get('/', async (req, res, next) => {
  try {
    const dashboard = await readStore((db) => {
      const revenue = db.sales.reduce((sum, sale) => sum + sale.total, 0)
      const cost = db.sales.reduce((sum, sale) => sum + sale.lines.reduce((lineSum, line) => lineSum + line.cost * line.qty, 0), 0)
      const soldByItem = new Map(db.items.map((item) => [item.id, 0]))
      for (const sale of db.sales) for (const line of sale.lines) soldByItem.set(line.itemId, (soldByItem.get(line.itemId) || 0) + line.qty)
      const itemSales = db.items.map((item) => ({ name: item.name, sku: item.sku, sold: soldByItem.get(item.id) || 0 }))

      const now = new Date()
      const trend = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - index))
        const key = date.toISOString().slice(0, 10)
        return { day: dayNames[date.getDay()], revenue: db.sales.filter((sale) => sale.timestamp.slice(0, 10) === key).reduce((sum, sale) => sum + sale.total, 0) }
      })

      const heatmap = ['10A', '12P', '2P', '4P', '6P'].map((time) => {
        const row = { time }
        for (const day of dayNames.slice(1).concat('Sun')) row[day] = 0
        return row
      })
      for (const sale of db.sales) {
        const date = new Date(sale.timestamp)
        const slot = Math.min(4, Math.max(0, Math.floor((date.getHours() - 10) / 2)))
        if (date.getHours() >= 10 && date.getHours() < 20) heatmap[slot][dayNames[date.getDay()]] += 1
      }
      const maxActivity = Math.max(1, ...heatmap.flatMap((row) => dayNames.map((day) => row[day] || 0)))
      for (const row of heatmap) for (const day of dayNames) row[day] = Math.round(((row[day] || 0) / maxActivity) * 10)

      return {
        totalRevenue: revenue,
        totalSales: db.sales.length,
        averageTicket: db.sales.length ? revenue / db.sales.length : 0,
        totalCost: cost,
        margin: revenue - cost,
        marginPct: revenue ? ((revenue - cost) / revenue) * 100 : 0,
        revenueTrend: trend,
        heatmap,
        topSellers: [...itemSales].sort((a, b) => b.sold - a.sold || a.name.localeCompare(b.name)).slice(0, 5),
        slowMovers: [...itemSales].sort((a, b) => a.sold - b.sold || a.name.localeCompare(b.name)).slice(0, 5),
      }
    })
    res.json(dashboard)
  } catch (error) { next(error) }
})

export default router
