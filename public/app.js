import { renderTasks } from './components/taskList.js';
import { renderProjects } from './components/projectPicker.js';
import { renderTags } from './components/tagFilter.js';
import { toast } from './components/toast.js';

const state = { projectId: '', tag: '', query: '' };

const els = {
  tasks: document.querySelector('#task-list'),
  projects: document.querySelector('#project-picker'),
  tags: document.querySelector('#tag-filter'),
  search: document.querySelector('#search'),
  form: document.querySelector('#new-task'),
};

async function api(path, options) {
  const res = await fetch(path, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? res.statusText);
  }
  return res.json();
}

async function loadTasks() {
  if (state.query) return api(`/api/search?q=${encodeURIComponent(state.query)}`);
  const params = new URLSearchParams();
  if (state.projectId) params.set('projectId', state.projectId);
  if (state.tag) params.set('tag', state.tag);
  return api(`/api/tasks?${params}`);
}

async function refresh() {
  try {
    const [tasks, projects, tags] = await Promise.all([
      loadTasks(),
      api('/api/projects'),
      api('/api/tags'),
    ]);
    renderTasks(els.tasks, tasks, { onStateChange: setState });
    renderProjects(els.projects, projects, {
      selected: state.projectId,
      onSelect: (id) => { state.projectId = id; refresh(); },
    });
    renderTags(els.tags, tags, {
      selected: state.tag,
      onSelect: (tag) => { state.tag = tag; refresh(); },
    });
  } catch (e) {
    toast(e.message);
  }
}

async function setState(id, next) {
  await api(`/api/task/state?id=${id}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ state: next }),
  });
  refresh();
}

els.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  try {
    await api('/api/tasks', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: data.get('title'),
        tags: String(data.get('tags') || '').split(',').filter(Boolean),
        projectId: state.projectId || null,
      }),
    });
    e.target.reset();
    refresh();
  } catch (err) {
    toast(err.message);
  }
});

let debounce;
els.search.addEventListener('input', () => {
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    state.query = els.search.value.trim();
    refresh();
  }, 200);
});

refresh();
