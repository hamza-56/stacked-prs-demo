export function logRequest(req, url) {
  const line = `${new Date().toISOString()} ${req.method} ${url.pathname}${url.search}`;
  if (process.env.NODE_ENV !== 'test') console.log(line);
  return line;
}
