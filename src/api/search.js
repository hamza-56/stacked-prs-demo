import { route } from '../server.js';
import { sendResult } from '../lib/json.js';
import { search } from '../services/searchService.js';

export function registerSearchRoutes() {
  route('GET', '/api/search', (req, res, url) => {
    sendResult(res, search(url.searchParams.get('q') ?? ''));
  });
}
