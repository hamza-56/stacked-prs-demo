import { json } from '../lib/json.js';

export function handleError(res, error) {
  const status = error.status ?? 500;
  if (status >= 500 && process.env.NODE_ENV !== 'test') console.error(error);
  json(res, status, { error: error.message ?? 'internal error' });
}
