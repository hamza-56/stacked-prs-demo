import test from 'node:test';
import assert from 'node:assert/strict';
import { registerRoutes } from '../src/api.js';
import { handle } from '../src/server.js';
import { createTask, reset } from '../src/models.js';

registerRoutes();

function call(method, url) {
  return new Promise((resolve) => {
    const chunks = [];
    const res = {
      writeHead(status) { this.status = status; return this; },
      end(body) { if (body) chunks.push(body); resolve({ status: this.status, body: chunks.join('') }); },
    };
    handle({ method, url, on: () => {} }, res);
  });
}

test('GET /api/tasks returns the list', async () => {
  reset();
  createTask({ title: 'demo', tags: ['talk'] });
  const res = await call('GET', '/api/tasks');
  assert.equal(res.status, 200);
  assert.equal(JSON.parse(res.body).length, 1);
});

test('unknown route is a 404', async () => {
  const res = await call('GET', '/nope');
  assert.equal(res.status, 404);
});
