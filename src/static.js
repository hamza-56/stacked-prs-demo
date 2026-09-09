import { readFile } from 'node:fs/promises';
import { route } from './server.js';

const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
};

const FILES = [
  ['/', 'index.html'],
  ['/app.js', 'app.js'],
  ['/styles.css', 'styles.css'],
  ['/components/taskList.js', 'components/taskList.js'],
  ['/components/projectPicker.js', 'components/projectPicker.js'],
  ['/components/tagFilter.js', 'components/tagFilter.js'],
  ['/components/toast.js', 'components/toast.js'],
];

async function serve(res, file) {
  try {
    const body = await readFile(new URL(`../public/${file}`, import.meta.url));
    const ext = file.slice(file.lastIndexOf('.'));
    res.writeHead(200, { 'content-type': types[ext] ?? 'text/plain' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
  }
}

export function registerStatic() {
  for (const [path, file] of FILES) {
    route('GET', path, (req, res) => serve(res, file));
  }
}
