export const categories = ['Helmets', 'Jackets', 'Gloves', 'Boots', 'Tires', 'Parts']

export const items = [
  { id: 1, name: 'Shoei RF-1400', sku: 'SKU-HLM-9001', category: 'Helmets', variant: 'L / Matte Black', size: 'Large', color: 'Matte Black', price: 620, cost: 410, stock: 4, lowStockAt: 3, barcode: '8901234561' },
  { id: 2, name: 'Shoei RF-1400', sku: 'SKU-HLM-9002', category: 'Helmets', variant: 'M / Matte Black', size: 'Medium', color: 'Matte Black', price: 620, cost: 410, stock: 2, lowStockAt: 3, barcode: '8901234562' },
  { id: 3, name: 'Alpinestars GP Plus R', sku: 'SKU-JKT-4022', category: 'Jackets', variant: 'XL / Black-Red', size: 'X-Large', color: 'Black-Red', price: 480, cost: 290, stock: 6, lowStockAt: 2, barcode: '8901234563' },
  { id: 4, name: 'Dainese Carbon 3', sku: 'SKU-GLV-1100', category: 'Gloves', variant: 'L / Black', size: 'Large', color: 'Black', price: 210, cost: 120, stock: 0, lowStockAt: 3, barcode: '8901234564' },
  { id: 5, name: 'TCX Street Ace', sku: 'SKU-BT-5500', category: 'Boots', variant: '43 / Black', size: '43', color: 'Black', price: 260, cost: 150, stock: 8, lowStockAt: 3, barcode: '8901234565' },
  { id: 6, name: 'Michelin Road 6', sku: 'SKU-TIRE-6600', category: 'Tires', variant: '180/55 ZR17', size: '180/55 ZR17', color: '-', price: 240, cost: 165, stock: 12, lowStockAt: 4, barcode: '8901234566' },
  { id: 7, name: 'Brembo Brake Pads', sku: 'SKU-PRT-7700', category: 'Parts', variant: 'Front Set', size: 'Front Set', color: '-', price: 85, cost: 45, stock: 15, lowStockAt: 5, barcode: '8901234567' },
]

export const suppliers = [
  { id: 1, name: 'Alpine Moto Distribution', shortId: 'APX-01', contact: '+216 55 123 456', contactPerson: 'Sarah Jenkins', phone: '555-0192', terms: 'Net 30', categories: ['Helmets', 'Parts'] },
  { id: 2, name: 'RoadGear Wholesale', shortId: 'RGW-02', contact: '+216 22 987 654', contactPerson: 'Marcus Cole', phone: '555-0833', terms: 'COD', categories: ['Jackets', 'Gloves'] },
  { id: 3, name: 'TireHub Tunisia', shortId: 'THT-03', contact: '+216 98 456 123', contactPerson: 'Ahmed Ben Ali', phone: '555-0441', terms: 'Net 15', categories: ['Tires', 'Boots'] },
]

export const purchaseOrders = [
  { id: 'PO-9921', supplierId: 1, date: '2026-08-20', status: 'Pending', items: [{ itemId: 1, qty: 5, cost: 410 }, { itemId: 2, qty: 5, cost: 410 }] },
  { id: 'PO-9920', supplierId: 2, date: '2026-08-25', status: 'Received', items: [{ itemId: 3, qty: 8, cost: 290 }] },
  { id: 'PO-9918', supplierId: 3, date: '2026-08-29', status: 'Received', items: [{ itemId: 6, qty: 20, cost: 165 }] },
]

export const sales = [
  { id: 101, txnId: 'TXN-8892-A', timestamp: '2026-09-01T09:15:00', total: 620, paymentMethod: 'Card', paymentDetail: 'Visa ending 4421', lines: [{ itemId: 1, qty: 1, price: 620 }] },
  { id: 102, txnId: 'TXN-8891-B', timestamp: '2026-09-01T11:40:00', total: 480, paymentMethod: 'Cash', paymentDetail: '', lines: [{ itemId: 3, qty: 1, price: 480 }] },
  { id: 103, txnId: 'TXN-8890-C', timestamp: '2026-09-01T14:05:00', total: 325, paymentMethod: 'Financing', paymentDetail: '', lines: [{ itemId: 5, qty: 1, price: 260 }, { itemId: 7, qty: 1, price: 85 }] },
  { id: 104, txnId: 'TXN-8889-D', timestamp: '2026-09-01T17:30:00', total: 240, paymentMethod: 'Card', paymentDetail: 'Visa ending 8812', lines: [{ itemId: 6, qty: 1, price: 240 }] },
  { id: 105, txnId: 'TXN-8888-E', timestamp: '2026-09-02T10:10:00', total: 210, paymentMethod: 'Cash', paymentDetail: '', lines: [{ itemId: 4, qty: 1, price: 210 }] },
  { id: 106, txnId: 'TXN-8887-F', timestamp: '2026-09-02T16:50:00', total: 850, paymentMethod: 'Card', paymentDetail: 'Visa ending 3301', lines: [{ itemId: 1, qty: 1, price: 620 }, { itemId: 7, qty: 1, price: 85 }, { itemId: 7, qty: 1, price: 85 }] },
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

// Heatmap data: rows=time slots, cols=days of week
// Values 0-10 represent activity intensity
export const heatmapData = [
  { time: '10A', Mon: 2, Tue: 1, Wed: 2, Thu: 1, Fri: 2, Sat: 6, Sun: 4 },
  { time: '12P', Mon: 5, Tue: 2, Wed: 4, Thu: 2, Fri: 6, Sat: 8, Sun: 7 },
  { time: '2P',  Mon: 7, Tue: 3, Wed: 7, Thu: 2, Fri: 9, Sat: 9, Sun: 6 },
  { time: '4P',  Mon: 6, Tue: 2, Wed: 6, Thu: 2, Fri: 7, Sat: 7, Sun: 3 },
  { time: '6P',  Mon: 2, Tue: 1, Wed: 2, Thu: 1, Fri: 4, Sat: 3, Sun: 2 },
]

export const topSellers = [
  { name: 'Shoei RF-1400', sku: 'SKU-HLM-9001', sold: 142 },
  { name: 'Dainese Carbon 3', sku: 'SKU-GLV-1100', sold: 98 },
  { name: 'Alpinestars GP Plus R', sku: 'SKU-JKT-4022', sold: 76 },
  { name: 'Michelin Road 6', sku: 'SKU-TIRE-6600', sold: 65 },
  { name: 'Brembo Brake Pads', sku: 'SKU-PRT-7700', sold: 54 },
]

export const slowMovers = [
  { name: 'Generic Bar Ends (Blue)', sku: 'GN-BE-BLU', sold: 2 },
  { name: 'Retro Leather Vest (XXL)', sku: 'RT-LV-XXL', sold: 3 },
  { name: 'Custom Mirror Mounts v1', sku: 'CM-MM-V1', sold: 4 },
  { name: 'Winter Touring Gloves (XS)', sku: 'WT-GLV-XS', sold: 5 },
  { name: 'Standard Chain Lube 100ml', sku: 'ST-CL-100', sold: 7 },
]
