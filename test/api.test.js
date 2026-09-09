import test from 'node:test';
import assert from 'node:assert/strict';
import { handle } from '../src/server.js';
import { registerRoutes } from '../src/api/index.js';
import { resetStore } from '../src/store/memory.js';
import { seed } from '../src/store/seed.js';
import { requireFields, pick } from '../src/middleware/validate.js';

registerRoutes();

function call(method, url, headers = {}) {
  return new Promise((resolve) => {
    const chunks = [];
    const res = {
      writeHead(status) { this.status = status; return this; },
      end(body) {
        if (body) chunks.push(body);
        resolve({ status: this.status, body: chunks.join('') });
      },
    };
    handle({ method, url, headers, on: () => {} }, res);
  });
}

test('GET /api/tasks returns seeded tasks', async () => {
  seed();
  const res = await call('GET', '/api/tasks');
  assert.equal(res.status, 200);
  assert.equal(JSON.parse(res.body).length, 2);
});

test('GET /api/tasks?tag= filters', async () => {
  seed();
  const res = await call('GET', '/api/tasks?tag=talk');
  assert.equal(JSON.parse(res.body).length, 1);
});

test('GET /api/tags returns counts', async () => {
  seed();
  const tags = JSON.parse((await call('GET', '/api/tags')).body);
  assert.ok(tags.some((t) => t.tag === 'talk'));
});

test('GET /api/me is 401 without a user header', async () => {
  resetStore();
  assert.equal((await call('GET', '/api/me')).status, 401);
});

test('unknown routes are 404', async () => {
  assert.equal((await call('GET', '/nope')).status, 404);
});

test('validators', () => {
  assert.throws(() => requireFields({}, ['title']), /missing fields: title/);
  assert.deepEqual(pick({ a: 1, b: 2 }, ['a']), { a: 1 });
});
