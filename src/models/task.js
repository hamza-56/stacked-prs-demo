import { nextId } from '../lib/ids.js';
import { now } from '../lib/dates.js';
import { normalizeTags } from './tag.js';

const STATES = ['todo', 'doing', 'done'];

export function makeTask({ title, tags = [], projectId = null, assigneeId = null, dueAt = null }) {
  if (!title || typeof title !== 'string') throw new Error('title is required');
  return {
    id: nextId('task'),
    title: title.trim(),
    state: 'todo',
    tags: normalizeTags(tags),
    projectId,
    assigneeId,
    dueAt,
    createdAt: now(),
    updatedAt: now(),
  };
}

export function transition(task, state) {
  if (!STATES.includes(state)) throw new Error(`unknown state: ${state}`);
  return { ...task, state, updatedAt: now() };
}

export function taskStates() {
  return [...STATES];
}
