import { resetIds } from '../lib/ids.js';

const collections = {
  tasks: new Map(),
  projects: new Map(),
  users: new Map(),
  comments: new Map(),
};

export function insert(kind, record) {
  collections[kind].set(record.id, record);
  return record;
}

export function update(kind, id, patch) {
  const existing = collections[kind].get(id);
  if (!existing) return null;
  const next = { ...existing, ...patch };
  collections[kind].set(id, next);
  return next;
}

export function find(kind, id) {
  return collections[kind].get(id) ?? null;
}

export function all(kind) {
  return [...collections[kind].values()];
}

export function remove(kind, id) {
  return collections[kind].delete(id);
}

export function resetStore() {
  for (const c of Object.values(collections)) c.clear();
  resetIds();
}
