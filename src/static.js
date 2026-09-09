import { readFile } from 'node:fs/promises';
import { route } from './server.js';

const types = { '.html': 'text/html', '.js': 'text/javascript' };

async function serve(res, file) {
  try {
    const body = await readFile(new URL(`../public/${file}`, import.meta.url));
    const ext = file.slice(file.lastIndexOf('.'));
    res.writeHead(200, { 'content-type': types[ext] ?? 'text/plain' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
}

export function registerStatic() {
  route('GET', '/', (req, res) => serve(res, 'index.html'));
  route('GET', '/app.js', (req, res) => serve(res, 'app.js'));
}
