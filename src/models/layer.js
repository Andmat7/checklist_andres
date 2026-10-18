import { create_task, is_done_on } from './task.js';

/**
 * @typedef {import('./task.js').Task} Task
 * @typedef {Object} Layer
 * @property {string} id
 * @property {string} title
 * @property {Task[]} tasks
 * @property {Layer[]} layers Inner pyramid, ordered from its base to its top.
 */

/** Ordered from the pyramid base to its top. */
export const default_layers = [
  {
    id: 'andres',
    title: 'Andres',
    tasks: [],
    layers: [
      { id: 'sleep', title: 'Sueño', tasks: [], layers: [] },
      { id: 'diet', title: 'Dieta', tasks: [], layers: [] },
      { id: 'exercise', title: 'Ejercicio', tasks: [], layers: [] },
    ],
  },
  { id: 'finances', title: 'Finanzas', tasks: [], layers: [] },
  { id: 'relationships', title: 'Relaciones', tasks: [], layers: [] },
];

/** Keeps saved tasks but takes the pyramid shape from the defaults, so new layers appear for existing users. */
export function merge_saved(defaults, saved) {
  return defaults.map((layer) => {
    const match = saved.find((saved_layer) => saved_layer.id === layer.id);
    return { ...layer, tasks: match?.tasks ?? [], layers: merge_saved(layer.layers, match?.layers ?? []) };
  });
}

export function all_layers(layers) {
  return layers.flatMap((layer) => [layer, ...all_layers(layer.layers)]);
}

export function update_layer(layers, layer_id, change) {
  return layers.map((layer) =>
    layer.id === layer_id ? change(layer) : { ...layer, layers: update_layer(layer.layers, layer_id, change) }
  );
}

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
