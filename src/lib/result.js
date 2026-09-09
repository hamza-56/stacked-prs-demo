export function ok(value) {
  return { ok: true, value };
}

export function err(message, code = 'invalid') {
  return { ok: false, error: { message, code } };
}

export function unwrap(result) {
  if (!result.ok) throw new Error(result.error.message);
  return result.value;
}
