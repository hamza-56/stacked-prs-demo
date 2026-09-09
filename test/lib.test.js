import test from 'node:test';
import assert from 'node:assert/strict';
import { nextId, resetIds } from '../src/lib/ids.js';
import { ok, err, unwrap } from '../src/lib/result.js';
import { daysBetween, isPast } from '../src/lib/dates.js';

test('nextId increments per kind', () => {
  resetIds();
  assert.equal(nextId('task'), 'task_1');
  assert.equal(nextId('task'), 'task_2');
  assert.equal(nextId('user'), 'user_1');
});

test('unwrap throws on an error result', () => {
  assert.equal(unwrap(ok(42)), 42);
  assert.throws(() => unwrap(err('nope')), /nope/);
});

test('date helpers', () => {
  assert.equal(daysBetween('2026-01-01', '2026-01-11'), 10);
  assert.equal(isPast('2000-01-01'), true);
});
