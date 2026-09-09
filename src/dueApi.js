import { route } from './server.js';
import { parseDue, dueLabel } from './due.js';

export function registerDueRoutes() {
  route('GET', '/api/due', (req, res, url) => {
    const iso = parseDue(url.searchParams.get('at'));
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ dueAt: iso, label: dueLabel(iso) }));
  });
}
