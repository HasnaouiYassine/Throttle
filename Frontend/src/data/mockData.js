export const categories = [
  { id: 'engine', name: 'Engine' },
  { id: 'brakes', name: 'Brakes' },
  { id: 'drive', name: 'Drive & Chain' },
  { id: 'electrical', name: 'Electrical' },
  { id: 'suspension', name: 'Suspension' },
  { id: 'tires', name: 'Tires & Wheels' },
  { id: 'filters', name: 'Filters & Fluids' },
]

export const items = [
  { id: 1, name: 'NGK Iridium Spark Plug DPR8EIX-9', sku: 'SKU-ENG-1001', category: 'Engine', variant: 'Iridium / Single', size: 'M12x1.25', color: '-', price: 45, cost: 22, stock: 40, lowStockAt: 10, barcode: '8901234501', image: '/parts/engine.svg' },
  { id: 2, name: 'Vertex Piston Kit 66.40mm KTM EXC', sku: 'SKU-ENG-1002', category: 'Engine', variant: '66.40mm / Std Compression', size: '66.40mm', color: '-', price: 480, cost: 310, stock: 5, lowStockAt: 3, barcode: '8901234502', image: '/parts/engine.svg' },
  { id: 3, name: 'K&N High-Flow Air Filter YA-6006', sku: 'SKU-ENG-1003', category: 'Engine', variant: 'Cotton / Washable', size: 'OEM Fit', color: '-', price: 220, cost: 130, stock: 7, lowStockAt: 3, barcode: '8901234503', image: '/parts/engine.svg' },
  { id: 4, name: 'EBC Clutch Kit DRC Series YZ250F', sku: 'SKU-ENG-1004', category: 'Engine', variant: 'Full Kit / Springs', size: 'Full Kit', color: '-', price: 650, cost: 420, stock: 3, lowStockAt: 2, barcode: '8901234504', image: '/parts/engine.svg' },
  { id: 5, name: 'Brembo Front Brake Disc 320mm', sku: 'SKU-BRK-2001', category: 'Brakes', variant: 'Floating / 320mm', size: '320mm', color: '-', price: 520, cost: 340, stock: 5, lowStockAt: 3, barcode: '8901234505', image: '/parts/brakes.svg' },
  { id: 6, name: 'Brembo Sintered Brake Pads 07YA23', sku: 'SKU-BRK-2002', category: 'Brakes', variant: 'Front Set / Sintered', size: 'Front Set', color: '-', price: 145, cost: 85, stock: 22, lowStockAt: 6, barcode: '8901234506', image: '/parts/brakes.svg' },
  { id: 7, name: 'CNC Adjustable Brake Lever Black', sku: 'SKU-BRK-2003', category: 'Brakes', variant: 'Shorty / Adjustable', size: 'Universal', color: 'Black', price: 160, cost: 90, stock: 14, lowStockAt: 5, barcode: '8901234507', image: '/parts/brakes.svg' },
  { id: 8, name: 'DID 520VX3 X-Ring Chain 120 Links', sku: 'SKU-DRV-3001', category: 'Drive & Chain', variant: '520 / 120 Links Gold', size: '120 Links', color: 'Gold', price: 390, cost: 260, stock: 8, lowStockAt: 4, barcode: '8901234508', image: '/parts/drive.svg' },
  { id: 9, name: 'JT Sprocket Kit 15/45T MT-07', sku: 'SKU-DRV-3002', category: 'Drive & Chain', variant: '15F / 45R Steel', size: '15/45T', color: '-', price: 280, cost: 170, stock: 6, lowStockAt: 3, barcode: '8901234509', image: '/parts/drive.svg' },
  { id: 10, name: 'Yuasa YTX9-BS Battery 12V 8Ah', sku: 'SKU-ELC-4001', category: 'Electrical', variant: '12V / 8Ah AGM', size: '150x87x105mm', color: '-', price: 310, cost: 195, stock: 10, lowStockAt: 4, barcode: '8901234510', image: '/parts/electrical.svg' },
  { id: 11, name: 'NGK Ignition Coil LB05F', sku: 'SKU-ELC-4002', category: 'Electrical', variant: 'Plug Cap / 5k Ohm', size: 'Standard', color: 'Black', price: 180, cost: 105, stock: 12, lowStockAt: 5, barcode: '8901234511', image: '/parts/electrical.svg' },
  { id: 12, name: 'Philips H4 LED Headlight Bulb', sku: 'SKU-ELC-4003', category: 'Electrical', variant: 'H4 / 6000K White', size: 'H4', color: 'White', price: 130, cost: 70, stock: 15, lowStockAt: 5, barcode: '8901234512', image: '/parts/electrical.svg' },
  { id: 13, name: 'YSS Rear Shock MZ506 MT-07', sku: 'SKU-SUS-5001', category: 'Suspension', variant: 'Adjustable / Gas', size: 'OEM Length', color: 'Red', price: 890, cost: 600, stock: 4, lowStockAt: 2, barcode: '8901234513', image: '/parts/suspension.svg' },
  { id: 14, name: 'Fork Seal Kit 41mm KYB', sku: 'SKU-SUS-5002', category: 'Suspension', variant: '41mm / Oil+Dust', size: '41mm', color: '-', price: 95, cost: 50, stock: 18, lowStockAt: 6, barcode: '8901234514', image: '/parts/suspension.svg' },
  { id: 15, name: 'Michelin Road 6 Rear 180/55 ZR17', sku: 'SKU-TIR-6001', category: 'Tires & Wheels', variant: '180/55 ZR17 TL', size: '180/55 ZR17', color: '-', price: 720, cost: 510, stock: 9, lowStockAt: 4, barcode: '8901234515', image: '/parts/tires.svg' },
  { id: 16, name: 'Pirelli Diablo Rosso IV Front 120/70', sku: 'SKU-TIR-6002', category: 'Tires & Wheels', variant: '120/70 ZR17 TL', size: '120/70 ZR17', color: '-', price: 580, cost: 400, stock: 7, lowStockAt: 3, barcode: '8901234516', image: '/parts/tires.svg' },
  { id: 17, name: 'Motul 7100 10W-40 Oil 1L', sku: 'SKU-FLD-7001', category: 'Filters & Fluids', variant: '10W-40 / Ester 1L', size: '1L', color: '-', price: 95, cost: 60, stock: 25, lowStockAt: 8, barcode: '8901234517', image: '/parts/fluids.svg' },
  { id: 18, name: 'Hiflofiltro Oil Filter HF204', sku: 'SKU-FLD-7002', category: 'Filters & Fluids', variant: 'Spin-On / Black', size: 'Standard', color: 'Black', price: 35, cost: 15, stock: 50, lowStockAt: 12, barcode: '8901234518', image: '/parts/fluids.svg' },
  { id: 19, name: 'Motul Motocool Coolant 1L', sku: 'SKU-FLD-7003', category: 'Filters & Fluids', variant: 'Ready-to-Use / -35C', size: '1L', color: 'Yellow', price: 55, cost: 28, stock: 30, lowStockAt: 8, barcode: '8901234519', image: '/parts/fluids.svg' },
  { id: 20, name: 'K&N Oil Filter KN-204C Chrome', sku: 'SKU-FLD-7004', category: 'Filters & Fluids', variant: 'Nut-End / Chrome', size: 'Standard', color: 'Chrome', price: 65, cost: 32, stock: 0, lowStockAt: 6, barcode: '8901234520', image: '/parts/fluids.svg' },
]

export const categoryIdByName = Object.fromEntries(categories.map(c => [c.name, c.id]))

export const getCategoryId = (itemOrName) => {
  const name = typeof itemOrName === 'string' ? itemOrName : itemOrName?.category
  return categoryIdByName[name] || 'engine'
}

export const suppliers = [
  { id: 1, name: 'MotoParts Tunisia', shortId: 'MPT-01', contact: '+216 55 123 456', contactPerson: 'Sarah Jenkins', phone: '555-0192', terms: 'Net 30', categories: ['Engine', 'Filters & Fluids'] },
  { id: 2, name: 'BrakePro Distribution', shortId: 'BPD-02', contact: '+216 22 987 654', contactPerson: 'Marcus Cole', phone: '555-0833', terms: 'COD', categories: ['Brakes', 'Suspension'] },
  { id: 3, name: 'ElectroMoto Wholesale', shortId: 'EMW-03', contact: '+216 98 456 123', contactPerson: 'Ahmed Ben Ali', phone: '555-0441', terms: 'Net 15', categories: ['Electrical', 'Drive & Chain'] },
  { id: 4, name: 'TireHub Tunisia', shortId: 'THT-04', contact: '+216 71 340 890', contactPerson: 'Yasmine Trabelsi', phone: '555-0775', terms: 'Net 15', categories: ['Tires & Wheels', 'Drive & Chain'] },
]

export const purchaseOrders = [
  { id: 'PO-9921', supplierId: 1, date: '2026-08-20', status: 'Pending', items: [{ itemId: 2, qty: 4, cost: 310 }, { itemId: 3, qty: 6, cost: 130 }] },
  { id: 'PO-9920', supplierId: 2, date: '2026-08-25', status: 'Received', items: [{ itemId: 6, qty: 20, cost: 85 }, { itemId: 7, qty: 10, cost: 90 }] },
  { id: 'PO-9919', supplierId: 3, date: '2026-08-27', status: 'Pending', items: [{ itemId: 8, qty: 10, cost: 260 }, { itemId: 10, qty: 8, cost: 195 }] },
  { id: 'PO-9918', supplierId: 4, date: '2026-08-29', status: 'Received', items: [{ itemId: 15, qty: 12, cost: 510 }, { itemId: 16, qty: 10, cost: 400 }] },
]

export const sales = [
  { id: 101, txnId: 'TXN-8892-A', timestamp: '2026-09-01T09:15:00', total: 140, paymentMethod: 'Card', paymentDetail: 'Visa ending 4421', lines: [{ itemId: 17, qty: 1, price: 95 }, { itemId: 1, qty: 1, price: 45 }] },
  { id: 102, txnId: 'TXN-8891-B', timestamp: '2026-09-01T11:40:00', total: 390, paymentMethod: 'Cash', paymentDetail: '', lines: [{ itemId: 8, qty: 1, price: 390 }] },
  { id: 103, txnId: 'TXN-8890-C', timestamp: '2026-09-01T14:05:00', total: 455, paymentMethod: 'Financing', paymentDetail: '', lines: [{ itemId: 10, qty: 1, price: 310 }, { itemId: 6, qty: 1, price: 145 }] },
  { id: 104, txnId: 'TXN-8889-D', timestamp: '2026-09-01T17:30:00', total: 720, paymentMethod: 'Card', paymentDetail: 'Visa ending 8812', lines: [{ itemId: 15, qty: 1, price: 720 }] },
  { id: 105, txnId: 'TXN-8888-E', timestamp: '2026-09-02T10:10:00', total: 215, paymentMethod: 'Cash', paymentDetail: '', lines: [{ itemId: 12, qty: 1, price: 130 }, { itemId: 19, qty: 1, price: 55 }, { itemId: 18, qty: 1, price: 35 }] },
  { id: 106, txnId: 'TXN-8887-F', timestamp: '2026-09-02T16:50:00', total: 665, paymentMethod: 'Card', paymentDetail: 'Visa ending 3301', lines: [{ itemId: 5, qty: 1, price: 520 }, { itemId: 6, qty: 1, price: 145 }] },
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
  { name: 'Hiflofiltro Oil Filter HF204', sku: 'SKU-FLD-7002', sold: 186 },
  { name: 'NGK Iridium Spark Plug DPR8EIX-9', sku: 'SKU-ENG-1001', sold: 142 },
  { name: 'Motul 7100 10W-40 Oil 1L', sku: 'SKU-FLD-7001', sold: 121 },
  { name: 'Brembo Sintered Brake Pads 07YA23', sku: 'SKU-BRK-2002', sold: 98 },
  { name: 'DID 520VX3 X-Ring Chain 120 Links', sku: 'SKU-DRV-3001', sold: 76 },
]

export const slowMovers = [
  { name: 'EBC Clutch Kit DRC Series YZ250F', sku: 'SKU-ENG-1004', sold: 3 },
  { name: 'YSS Rear Shock MZ506 MT-07', sku: 'SKU-SUS-5001', sold: 4 },
  { name: 'Vertex Piston Kit 66.40mm KTM EXC', sku: 'SKU-ENG-1002', sold: 5 },
  { name: 'Brembo Front Brake Disc 320mm', sku: 'SKU-BRK-2001', sold: 7 },
  { name: 'K&N Oil Filter KN-204C Chrome', sku: 'SKU-FLD-7004', sold: 8 },
]
