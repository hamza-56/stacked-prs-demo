import { route } from '../server.js';
import { all } from '../store/memory.js';
import { json } from '../lib/json.js';
import { currentUser } from '../middleware/auth.js';

export function registerUserRoutes() {
  route('GET', '/api/users', (req, res) => json(res, 200, all('users')));
  route('GET', '/api/me', (req, res) => {
    const user = currentUser(req);
    json(res, user ? 200 : 401, user ?? { error: 'authentication required' });
  });
}
