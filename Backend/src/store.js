import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dataDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'data')
const storePath = path.join(dataDir, 'store.json')

const initialState = () => ({
  nextIds: { item: 1, supplier: 1, order: 1, sale: 1 },
  items: [],
  suppliers: [],
  orders: [],
  sales: [],
})

let state
let writeQueue = Promise.resolve()

export async function loadStore() {
  if (state) return state
  try {
    state = JSON.parse(await readFile(storePath, 'utf8'))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    state = initialState()
    await persist()
  }
  state.nextIds ||= { item: 1, supplier: 1, order: 1, sale: 1 }
  for (const key of ['items', 'suppliers', 'orders', 'sales']) state[key] ||= []
  return state
}

async function persist() {
  await mkdir(dataDir, { recursive: true })
  await writeFile(storePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8')
}

// Keeps changes serialized so rapid POS checkouts cannot overwrite one another.
export async function updateStore(mutator) {
  const run = writeQueue.then(async () => {
    await loadStore()
    const result = await mutator(state)
    await persist()
    return result
  })
  writeQueue = run.catch(() => {})
  return run
}

export async function readStore(selector = (value) => value) {
  await writeQueue
  return selector(await loadStore())
}

export function nextId(draft, type) {
  const id = draft.nextIds[type] || 1
  draft.nextIds[type] = id + 1
  return id
}
