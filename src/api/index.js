import { registerTaskRoutes } from './tasks.js';
import { registerProjectRoutes } from './projects.js';
import { registerTagRoutes } from './tags.js';
import { registerUserRoutes } from './users.js';
import { registerSearchRoutes } from './search.js';

export function registerRoutes() {
  registerTaskRoutes();
  registerProjectRoutes();
  registerTagRoutes();
  registerUserRoutes();
  registerSearchRoutes();
}
