let nextId = 1;
const tasks = new Map();

export function createTask({ title, tags = [] }) {
  if (!title || typeof title !== 'string') {
    throw new Error('title is required');
  }
  const task = {
    id: nextId++,
    title,
    tags: normalizeTags(tags),
    done: false,
    createdAt: new Date().toISOString(),
  };
  tasks.set(task.id, task);
  return task;
}

export function listTasks({ tag } = {}) {
  const all = [...tasks.values()];
  return tag ? all.filter((t) => t.tags.includes(tag)) : all;
}

export function getTask(id) {
  return tasks.get(Number(id)) ?? null;
}

export function normalizeTags(tags) {
  return [...new Set(tags.map((t) => String(t).trim().toLowerCase()))]
    .filter(Boolean)
    .sort();
}

export function reset() {
  tasks.clear();
  nextId = 1;
}
