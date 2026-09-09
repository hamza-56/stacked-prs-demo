import test from 'node:test';
import assert from 'node:assert/strict';
import { resetStore } from '../src/store/memory.js';
import { seed } from '../src/store/seed.js';
import { createTask, listTasks, setState, retagTask, getTask } from '../src/services/taskService.js';
import { createProject, listProjects, archiveProject } from '../src/services/projectService.js';
import { listTags, suggestTags } from '../src/services/tagService.js';
import { search } from '../src/services/searchService.js';
import { deliveredNotifications, clearNotifications } from '../src/services/notificationService.js';

test('createTask emits a notification', () => {
  resetStore();
  clearNotifications();
  const result = createTask({ title: 'demo', tags: ['talk'] });
  assert.ok(result.ok);
  assert.equal(deliveredNotifications().at(-1).event, 'task.created');
});

test('listTasks filters by tag and state', () => {
  resetStore();
  createTask({ title: 'a', tags: ['demo'] });
  const b = createTask({ title: 'b', tags: ['talk'] });
  setState(b.value.id, 'done');
  assert.equal(listTasks({ tag: 'demo' }).value.length, 1);
  assert.equal(listTasks({ state: 'done' }).value.length, 1);
  assert.equal(listTasks().value.length, 2);
});

test('missing records return not_found', () => {
  resetStore();
  assert.equal(getTask('nope').error.code, 'not_found');
  assert.equal(retagTask('nope', []).error.code, 'not_found');
  assert.equal(archiveProject('nope').error.code, 'not_found');
});

test('projects hide archived by default', () => {
  resetStore();
  const p = createProject({ name: 'Platform' });
  archiveProject(p.value.id);
  assert.equal(listProjects().value.length, 0);
  assert.equal(listProjects({ includeArchived: true }).value.length, 1);
});

test('tag listing and suggestions', () => {
  seed();
  assert.ok(listTags().value.length > 0);
  assert.ok(suggestTags('ta').value.every((t) => t.tag.startsWith('ta')));
});

test('search ranks multi-term matches first', () => {
  resetStore();
  createTask({ title: 'stacked pull requests talk', tags: ['talk'] });
  createTask({ title: 'unrelated chore', tags: [] });
  const hits = search('stacked talk').value;
  assert.equal(hits.length, 1);
  assert.match(hits[0].title, /stacked/);
  assert.deepEqual(search('').value, []);
});
