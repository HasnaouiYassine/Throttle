export const categories = ['Helmets', 'Jackets', 'Gloves', 'Boots', 'Tires', 'Parts']

export const items = [
  { id: 1, name: 'Shoei RF-1400', category: 'Helmets', variant: 'L / Matte Black', price: 620, cost: 410, stock: 4, lowStockAt: 3, barcode: '8901234561' },
  { id: 2, name: 'Shoei RF-1400', category: 'Helmets', variant: 'M / Matte Black', price: 620, cost: 410, stock: 2, lowStockAt: 3, barcode: '8901234562' },
  { id: 3, name: 'Alpinestars GP Plus R', category: 'Jackets', variant: 'XL / Black-Red', price: 480, cost: 290, stock: 6, lowStockAt: 2, barcode: '8901234563' },
  { id: 4, name: 'Dainese Carbon 3', category: 'Gloves', variant: 'L / Black', price: 210, cost: 120, stock: 1, lowStockAt: 3, barcode: '8901234564' },
  { id: 5, name: 'TCX Street Ace', category: 'Boots', variant: '43 / Black', price: 260, cost: 150, stock: 8, lowStockAt: 3, barcode: '8901234565' },
  { id: 6, name: 'Michelin Road 6', category: 'Tires', variant: '180/55 ZR17', price: 240, cost: 165, stock: 12, lowStockAt: 4, barcode: '8901234566' },
  { id: 7, name: 'Brembo Brake Pads', category: 'Parts', variant: 'Front Set', price: 85, cost: 45, stock: 15, lowStockAt: 5, barcode: '8901234567' },
]

export const suppliers = [
  { id: 1, name: 'Alpine Moto Distribution', contact: '+216 55 123 456' },
  { id: 2, name: 'RoadGear Wholesale', contact: '+216 22 987 654' },
  { id: 3, name: 'TireHub Tunisia', contact: '+216 98 456 123' },
]

export const purchaseOrders = [
  { id: 1, supplierId: 1, date: '2026-08-20', status: 'Received', items: [{ itemId: 1, qty: 5, cost: 410 }, { itemId: 2, qty: 5, cost: 410 }] },
  { id: 2, supplierId: 2, date: '2026-08-25', status: 'Received', items: [{ itemId: 3, qty: 8, cost: 290 }] },
  { id: 3, supplierId: 3, date: '2026-08-29', status: 'Pending', items: [{ itemId: 6, qty: 20, cost: 165 }] },
]

export const sales = [
  { id: 101, timestamp: '2026-09-01T09:15:00', total: 620, lines: [{ itemId: 1, qty: 1, price: 620 }] },
  { id: 102, timestamp: '2026-09-01T11:40:00', total: 480, lines: [{ itemId: 3, qty: 1, price: 480 }] },
  { id: 103, timestamp: '2026-09-01T14:05:00', total: 325, lines: [{ itemId: 5, qty: 1, price: 260 }, { itemId: 7, qty: 1, price: 85 }] },
  { id: 104, timestamp: '2026-09-01T17:30:00', total: 240, lines: [{ itemId: 6, qty: 1, price: 240 }] },
  { id: 105, timestamp: '2026-09-02T10:10:00', total: 210, lines: [{ itemId: 4, qty: 1, price: 210 }] },
  { id: 106, timestamp: '2026-09-02T16:50:00', total: 850, lines: [{ itemId: 1, qty: 1, price: 620 }, { itemId: 7, qty: 1, price: 85 }, { itemId: 7, qty: 1, price: 85 }] },
]

export const revenueTrend = [
  { day: 'Mon', revenue: 980 }, { day: 'Tue', revenue: 1240 }, { day: 'Wed', revenue: 760 },
  { day: 'Thu', revenue: 1510 }, { day: 'Fri', revenue: 1890 }, { day: 'Sat', revenue: 2230 }, { day: 'Sun', revenue: 1105 },
]

export const peakHours = [
  { hour: '9am', sales: 2 }, { hour: '10am', sales: 4 }, { hour: '11am', sales: 6 },
  { hour: '12pm', sales: 5 }, { hour: '1pm', sales: 3 }, { hour: '2pm', sales: 4 },
  { hour: '3pm', sales: 6 }, { hour: '4pm', sales: 8 }, { hour: '5pm', sales: 9 },
  { hour: '6pm', sales: 7 }, { hour: '7pm', sales: 3 },
]
