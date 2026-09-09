import { route } from './server.js';
import { createTask, listTasks, getTask } from './models.js';

function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

export function registerRoutes() {
  route('GET', '/api/tasks', (req, res, url) => {
    json(res, 200, listTasks({ tag: url.searchParams.get('tag') }));
  });

  route('POST', '/api/tasks', async (req, res) => {
    try {
      const body = await readBody(req);
      json(res, 201, createTask(body));
    } catch (err) {
      json(res, 400, { error: err.message });
    }
  });

  route('GET', '/api/task', (req, res, url) => {
    const task = getTask(url.searchParams.get('id'));
    task ? json(res, 200, task) : json(res, 404, { error: 'not found' });
  });
}
