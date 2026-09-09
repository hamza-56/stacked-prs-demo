import { insert, update, find, all } from '../store/memory.js';
import { makeTask, transition } from '../models/task.js';
import { normalizeTags } from '../models/tag.js';
import { ok, err } from '../lib/result.js';
import { notify } from './notificationService.js';

export function createTask(input) {
  try {
    const task = insert('tasks', makeTask(input));
    notify('task.created', task);
    return ok(task);
  } catch (e) {
    return err(e.message);
  }
}

export function listTasks({ tag, projectId, state, assigneeId } = {}) {
  let tasks = all('tasks');
  if (tag) tasks = tasks.filter((t) => t.tags.includes(tag.toLowerCase()));
  if (projectId) tasks = tasks.filter((t) => t.projectId === projectId);
  if (state) tasks = tasks.filter((t) => t.state === state);
  if (assigneeId) tasks = tasks.filter((t) => t.assigneeId === assigneeId);
  return ok(tasks);
}

export function getTask(id) {
  const task = find('tasks', id);
  return task ? ok(task) : err('task not found', 'not_found');
}

export function retagTask(id, tags) {
  const task = find('tasks', id);
  if (!task) return err('task not found', 'not_found');
  return ok(update('tasks', id, { tags: normalizeTags(tags) }));
}

export function setState(id, state) {
  const task = find('tasks', id);
  if (!task) return err('task not found', 'not_found');
  try {
    const next = update('tasks', id, transition(task, state));
    notify('task.state_changed', next);
    return ok(next);
  } catch (e) {
    return err(e.message);
  }
}
