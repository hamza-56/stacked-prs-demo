import { nextId } from '../lib/ids.js';
import { now } from '../lib/dates.js';

export function makeUser({ name, email }) {
  if (!name) throw new Error('name is required');
  if (!email || !email.includes('@')) throw new Error('valid email is required');
  return {
    id: nextId('user'),
    name,
    email: email.toLowerCase(),
    createdAt: now(),
  };
}

export function displayName(user) {
  return user ? user.name : 'Unassigned';
}
