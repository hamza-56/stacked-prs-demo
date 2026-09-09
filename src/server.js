import { createServer } from 'node:http';

const routes = [];

export function route(method, path, handler) {
  routes.push({ method, path, handler });
}

export function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const match = routes.find(
    (r) => r.method === req.method && r.path === url.pathname
  );
  if (!match) {
    res.writeHead(404, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ error: 'not found' }));
  }
  return match.handler(req, res, url);
}

export function start(port = 3000) {
  return createServer(handle).listen(port, () => {
    console.log(`listening on :${port}`);
  });
}

if (process.argv[1]?.endsWith('server.js')) {
  const { registerRoutes } = await import('./api.js');
  registerRoutes();
  start();
}
