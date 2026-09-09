import { all } from '../store/memory.js';
import { ok } from '../lib/result.js';

function score(task, terms) {
  const haystack = `${task.title} ${task.tags.join(' ')}`.toLowerCase();
  return terms.reduce((n, term) => (haystack.includes(term) ? n + 1 : n), 0);
}

export function search(query = '') {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return ok([]);
  const hits = all('tasks')
    .map((task) => ({ task, score: score(task, terms) }))
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((h) => h.task);
  return ok(hits);
}
