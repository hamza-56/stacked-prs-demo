import { route } from '../server.js';
import { readBody } from '../lib/body.js';
import { sendResult } from '../lib/json.js';
import { handleError } from '../middleware/errors.js';
import { requireFields, pick } from '../middleware/validate.js';
import {
  createTask, listTasks, getTask, retagTask, setState,
} from '../services/taskService.js';

export function registerTaskRoutes() {
  route('GET', '/api/tasks', (req, res, url) => {
    sendResult(res, listTasks({
      tag: url.searchParams.get('tag'),
      projectId: url.searchParams.get('projectId'),
      state: url.searchParams.get('state'),
      assigneeId: url.searchParams.get('assigneeId'),
    }));
  });

  route('POST', '/api/tasks', async (req, res) => {
    try {
      const body = requireFields(await readBody(req), ['title']);
      sendResult(res, createTask(pick(body, ['title', 'tags', 'projectId', 'assigneeId', 'dueAt'])), 201);
    } catch (e) {
      handleError(res, e);
    }
  });

  route('GET', '/api/task', (req, res, url) => {
    sendResult(res, getTask(url.searchParams.get('id')));
  });

  route('POST', '/api/task/tags', async (req, res, url) => {
    try {
      const body = await readBody(req);
      sendResult(res, retagTask(url.searchParams.get('id'), body.tags ?? []));
    } catch (e) {
      handleError(res, e);
    }
  });

  route('POST', '/api/task/state', async (req, res, url) => {
    try {
      const body = requireFields(await readBody(req), ['state']);
      sendResult(res, setState(url.searchParams.get('id'), body.state));
    } catch (e) {
      handleError(res, e);
    }
  });
}
