export function requireFields(body, fields) {
  const missing = fields.filter((f) => body[f] === undefined || body[f] === '');
  if (missing.length) throw new Error(`missing fields: ${missing.join(', ')}`);
  return body;
}

export function pick(body, fields) {
  return Object.fromEntries(
    Object.entries(body).filter(([k]) => fields.includes(k))
  );
}
