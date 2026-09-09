import { find } from '../store/memory.js';

export function currentUser(req) {
  const header = req.headers?.['x-user-id'];
  return header ? find('users', header) : null;
}

export function requireUser(req) {
  const user = currentUser(req);
  if (!user) throw Object.assign(new Error('authentication required'), { status: 401 });
  return user;
}
