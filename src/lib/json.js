export function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

export function sendResult(res, result, createdStatus = 200) {
  if (result.ok) return json(res, createdStatus, result.value);
  const status = result.error.code === 'not_found' ? 404 : 400;
  return json(res, status, { error: result.error.message });
}
