import { nextId } from '../lib/ids.js';
import { now } from '../lib/dates.js';

export function makeComment({ taskId, authorId, body }) {
  if (!taskId) throw new Error('taskId is required');
  if (!body || !body.trim()) throw new Error('body is required');
  return {
    id: nextId('comment'),
    taskId,
    authorId: authorId ?? null,
    body: body.trim(),
    createdAt: now(),
  };
}
