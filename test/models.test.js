import test from 'node:test';
import assert from 'node:assert/strict';
import { createTask, listTasks, normalizeTags, reset } from '../src/models.js';

test('normalizeTags trims, lowercases, dedupes and sorts', () => {
  assert.deepEqual(normalizeTags([' Urgent ', 'urgent', 'API']), ['api', 'urgent']);
});

test('createTask requires a title', () => {
  reset();
  assert.throws(() => createTask({}), /title is required/);
});

test('listTasks filters by tag', () => {
  reset();
  createTask({ title: 'ship stack demo', tags: ['demo'] });
  createTask({ title: 'write slides', tags: ['talk'] });
  assert.equal(listTasks({ tag: 'demo' }).length, 1);
  assert.equal(listTasks().length, 2);
});
