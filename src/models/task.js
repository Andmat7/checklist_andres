/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string | null} completed_on ISO date; a task counts as done only on that day, so checks reset daily.
 */

export function create_task(title) {
  return { id: crypto.randomUUID(), title, completed_on: null };
}

export function is_done_on(task, day) {
  return task.completed_on === day;
}
