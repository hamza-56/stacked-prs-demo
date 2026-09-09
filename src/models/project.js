import { nextId } from '../lib/ids.js';
import { now } from '../lib/dates.js';

const COLORS = ['slate', 'blue', 'green', 'amber', 'rose'];

export function makeProject({ name, color = 'slate' }) {
  if (!name) throw new Error('name is required');
  if (!COLORS.includes(color)) throw new Error(`color must be one of ${COLORS.join(', ')}`);
  return {
    id: nextId('project'),
    name,
    color,
    archived: false,
    createdAt: now(),
  };
}

export function projectColors() {
  return [...COLORS];
}
