const list = document.querySelector('#list');
const filter = document.querySelector('#filter');

async function load() {
  const tag = filter.value.trim();
  const res = await fetch('/api/tasks' + (tag ? `?tag=${encodeURIComponent(tag)}` : ''));
  const tasks = await res.json();
  list.innerHTML = '';
  for (const t of tasks) {
    const li = document.createElement('li');
    li.textContent = t.title + ' ';
    for (const tag of t.tags) {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tag;
      li.append(span, ' ');
    }
    list.append(li);
  }
}

document.querySelector('#new').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      title: data.get('title'),
      tags: String(data.get('tags') || '').split(',').filter(Boolean),
    }),
  });
  e.target.reset();
  load();
});

filter.addEventListener('input', load);
load();
