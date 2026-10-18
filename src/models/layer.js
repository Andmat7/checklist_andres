import { create_task, is_done_on } from './task.js';

/**
 * @typedef {import('./task.js').Task} Task
 * @typedef {Object} Layer
 * @property {string} id
 * @property {string} title
 * @property {Task[]} tasks
 */

/** Ordered from the pyramid base to its top. */
export const default_layers = [
  { id: 'andres', title: 'Andres', tasks: [] },
  { id: 'finances', title: 'Finanzas', tasks: [] },
  { id: 'relationships', title: 'Relaciones', tasks: [] },
];

export function add_task(layer, title) {
  return { ...layer, tasks: [...layer.tasks, create_task(title)] };
}

export function toggle_task(layer, task_id, day) {
  const tasks = layer.tasks.map((task) =>
    task.id === task_id ? { ...task, completed_on: is_done_on(task, day) ? null : day } : task
  );
  return { ...layer, tasks };
}

export function remove_task(layer, task_id) {
  return { ...layer, tasks: layer.tasks.filter((task) => task.id !== task_id) };
}

export function count_done(layer, day) {
  return layer.tasks.filter((task) => is_done_on(task, day)).length;
}
