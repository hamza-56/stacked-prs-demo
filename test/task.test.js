import test from 'node:test';
import assert from 'node:assert/strict';
import { makeTask, transition, taskStates } from '../src/models/task.js';
import { normalizeTags, tagCounts } from '../src/models/tag.js';
import { resetIds } from '../src/lib/ids.js';

test('makeTask requires a title', () => {
  resetIds();
  assert.throws(() => makeTask({}), /title is required/);
});

test('makeTask normalizes tags and starts in todo', () => {
  resetIds();
  const task = makeTask({ title: ' Ship it ', tags: [' Urgent ', 'urgent', 'API'] });
  assert.equal(task.title, 'Ship it');
  assert.deepEqual(task.tags, ['api', 'urgent']);
  assert.equal(task.state, 'todo');
});

test('transition rejects unknown states', () => {
  const task = makeTask({ title: 'x' });
  assert.equal(transition(task, 'done').state, 'done');
  assert.throws(() => transition(task, 'sideways'), /unknown state/);
  assert.deepEqual(taskStates(), ['todo', 'doing', 'done']);
});

test('tagCounts ranks by frequency then name', () => {
  const tasks = [
    { tags: ['api', 'urgent'] },
    { tags: ['api'] },
    { tags: ['zebra'] },
  ];
  assert.deepEqual(tagCounts(tasks), [
    { tag: 'api', count: 2 },
    { tag: 'urgent', count: 1 },
    { tag: 'zebra', count: 1 },
  ]);
});

test('normalizeTags drops blanks', () => {
  assert.deepEqual(normalizeTags(['  ', 'a', '']), ['a']);
});
