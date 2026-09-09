const listeners = [];
const delivered = [];

export function onNotification(fn) {
  listeners.push(fn);
  return () => listeners.splice(listeners.indexOf(fn), 1);
}

export function notify(event, payload) {
  const message = { event, payload, at: Date.now() };
  delivered.push(message);
  for (const fn of listeners) {
    try {
      fn(message);
    } catch {
      // a bad listener must not break the caller
    }
  }
  return message;
}

export function deliveredNotifications() {
  return [...delivered];
}

export function clearNotifications() {
  delivered.length = 0;
}
