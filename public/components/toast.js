const host = () => document.querySelector('#toast');

export function toast(message, ms = 2500) {
  const el = document.createElement('div');
  el.className = 'toast-item';
  el.textContent = message;
  host().append(el);
  setTimeout(() => el.remove(), ms);
}
