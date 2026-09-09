import { insert, resetStore } from './memory.js';
import { makeTask, makeProject, makeUser } from '../models/index.js';

export function seed() {
  resetStore();
  const alex = insert('users', makeUser({ name: 'Alex', email: 'alex@example.com' }));
  const platform = insert('projects', makeProject({ name: 'Platform', color: 'blue' }));
  const talks = insert('projects', makeProject({ name: 'Talks', color: 'amber' }));

  insert('tasks', makeTask({
    title: 'Record the stacked PRs walkthrough',
    tags: ['talk', 'video'],
    projectId: talks.id,
    assigneeId: alex.id,
  }));
  insert('tasks', makeTask({
    title: 'Split the tagging change into a stack',
    tags: ['platform', 'review'],
    projectId: platform.id,
  }));
  return { alex, platform, talks };
}
