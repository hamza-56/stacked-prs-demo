import { route } from '../server.js';
import { sendResult } from '../lib/json.js';
import { listTags, suggestTags } from '../services/tagService.js';

export function registerTagRoutes() {
  route('GET', '/api/tags', (req, res) => sendResult(res, listTags()));
  route('GET', '/api/tags/suggest', (req, res, url) => {
    sendResult(res, suggestTags(url.searchParams.get('q') ?? ''));
  });
}
