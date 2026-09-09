import { insert, update, find, all } from '../store/memory.js';
import { makeProject } from '../models/project.js';
import { ok, err } from '../lib/result.js';

export function createProject(input) {
  try {
    return ok(insert('projects', makeProject(input)));
  } catch (e) {
    return err(e.message);
  }
}

export function listProjects({ includeArchived = false } = {}) {
  const projects = all('projects');
  return ok(includeArchived ? projects : projects.filter((p) => !p.archived));
}

export function archiveProject(id) {
  const project = find('projects', id);
  if (!project) return err('project not found', 'not_found');
  return ok(update('projects', id, { archived: true }));
}
