let counters = new Map();

export function nextId(kind) {
  const n = (counters.get(kind) ?? 0) + 1;
  counters.set(kind, n);
  return `${kind}_${n}`;
}

export function resetIds() {
  counters = new Map();
}
