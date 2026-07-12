import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import type { Store } from './types.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '..', 'data')
const STORE_PATH = join(DATA_DIR, 'store.json')

const emptyStore: Store = {
  categories: [],
  products: [],
  orders: [],
}

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true })
  }
}

export function readStore(): Store {
  ensureDataDir()
  if (!existsSync(STORE_PATH)) {
    writeFileSync(STORE_PATH, JSON.stringify(emptyStore, null, 2))
    return { ...emptyStore }
  }
  return JSON.parse(readFileSync(STORE_PATH, 'utf-8')) as Store
}

export function writeStore(store: Store): void {
  ensureDataDir()
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2))
}
