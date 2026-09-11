export const categories = [
  { id: 'engine', name: 'Engine' },
  { id: 'brakes', name: 'Brakes' },
  { id: 'drive', name: 'Drive & Chain' },
  { id: 'electrical', name: 'Electrical' },
  { id: 'suspension', name: 'Suspension' },
  { id: 'tires', name: 'Tires & Wheels' },
  { id: 'filters', name: 'Filters & Fluids' },
]

export const categoryIdByName = Object.fromEntries(categories.map((category) => [category.name, category.id]))
export const getCategoryId = (itemOrName) => categoryIdByName[typeof itemOrName === 'string' ? itemOrName : itemOrName?.category] || 'engine'
