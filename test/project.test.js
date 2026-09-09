import test from 'node:test';
import assert from 'node:assert/strict';
import { makeProject, projectColors } from '../src/models/project.js';
import { makeUser, displayName } from '../src/models/user.js';
import { makeComment } from '../src/models/comment.js';

test('makeProject validates name and color', () => {
  assert.throws(() => makeProject({}), /name is required/);
  assert.throws(() => makeProject({ name: 'x', color: 'plaid' }), /color must be one of/);
  assert.equal(makeProject({ name: 'Platform', color: 'blue' }).archived, false);
  assert.ok(projectColors().includes('slate'));
});

test('makeUser lowercases the email and validates it', () => {
  assert.throws(() => makeUser({ name: 'A', email: 'nope' }), /valid email/);
  assert.equal(makeUser({ name: 'A', email: 'A@Example.COM' }).email, 'a@example.com');
  assert.equal(displayName(null), 'Unassigned');
});

test('makeComment requires a body', () => {
  assert.throws(() => makeComment({ taskId: 't1', body: '   ' }), /body is required/);
  assert.equal(makeComment({ taskId: 't1', body: ' hi ' }).body, 'hi');
});
