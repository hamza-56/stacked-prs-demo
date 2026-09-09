import { route } from '../server.js';
import { readBody } from '../lib/body.js';
import { sendResult } from '../lib/json.js';
import { handleError } from '../middleware/errors.js';
import { requireFields } from '../middleware/validate.js';
import { createProject, listProjects, archiveProject } from '../services/projectService.js';

export function registerProjectRoutes() {
  route('GET', '/api/projects', (req, res, url) => {
    sendResult(res, listProjects({
      includeArchived: url.searchParams.get('archived') === 'true',
    }));
  });

  route('POST', '/api/projects', async (req, res) => {
    try {
      const body = requireFields(await readBody(req), ['name']);
      sendResult(res, createProject(body), 201);
    } catch (e) {
      handleError(res, e);
    }
  });

  route('POST', '/api/project/archive', (req, res, url) => {
    sendResult(res, archiveProject(url.searchParams.get('id')));
  });
}
