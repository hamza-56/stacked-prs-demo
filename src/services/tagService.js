import { all } from '../store/memory.js';
import { tagCounts } from '../models/tag.js';
import { ok } from '../lib/result.js';

export function listTags() {
  return ok(tagCounts(all('tasks')));
}

export function suggestTags(prefix = '') {
  const p = prefix.trim().toLowerCase();
  const matches = tagCounts(all('tasks')).filter((t) => t.tag.startsWith(p));
  return ok(matches.slice(0, 10));
}
