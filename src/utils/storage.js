import { SEED_USERS, SEED_ITEMS, SEED_REQUESTS, SEED_VERSION } from '../data/seedData.js'

const KEYS = {
  version: 'recampus:version',
  users: 'recampus:users',
  items: 'recampus:items',
  requests: 'recampus:requests',
  currentUserId: 'recampus:currentUserId',
}

const read = (k, fb) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb } catch { return fb }
}
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v))

export function ensureSeed() {
  const ver = localStorage.getItem(KEYS.version)
  if (ver !== SEED_VERSION) {
    write(KEYS.version, SEED_VERSION)
    if (!localStorage.getItem(KEYS.users))    write(KEYS.users, SEED_USERS)
    if (!localStorage.getItem(KEYS.items))    write(KEYS.items, SEED_ITEMS)
    if (!localStorage.getItem(KEYS.requests)) write(KEYS.requests, SEED_REQUESTS)
  }
}

export function resetAll() {
  write(KEYS.users, SEED_USERS)
  write(KEYS.items, SEED_ITEMS)
  write(KEYS.requests, SEED_REQUESTS)
  localStorage.removeItem(KEYS.currentUserId)
}

export const Users = {
  all: () => read(KEYS.users, []),
  save: (list) => write(KEYS.users, list),
  update: (id, patch) => {
    const list = Users.all().map(u => u.id === id ? { ...u, ...patch } : u)
    Users.save(list); return list
  },
}

export const Items = {
  all: () => read(KEYS.items, []),
  save: (list) => write(KEYS.items, list),
  add: (item) => { const list = [item, ...Items.all()]; Items.save(list); return list },
  update: (id, patch) => {
    const list = Items.all().map(i => i.id === id ? { ...i, ...patch } : i)
    Items.save(list); return list
  },
}

export const Requests = {
  all: () => read(KEYS.requests, []),
  save: (list) => write(KEYS.requests, list),
  add: (req) => { const list = [req, ...Requests.all()]; Requests.save(list); return list },
  update: (id, patch) => {
    const list = Requests.all().map(r => r.id === id ? { ...r, ...patch } : r)
    Requests.save(list); return list
  },
}

export const Session = {
  get: () => localStorage.getItem(KEYS.currentUserId),
  set: (id) => write(KEYS.currentUserId, id),
  clear: () => localStorage.removeItem(KEYS.currentUserId),
}

export { KEYS }
