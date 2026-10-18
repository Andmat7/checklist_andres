import { is_checked } from './daily_checks.js';

/**
 * @typedef {import('./task.js').Task} Task
 * @typedef {import('./daily_checks.js').DailyChecks} DailyChecks
 * @typedef {Object} Layer
 * @property {string} id Title path, e.g. "/Andres/Sueño".
 * @property {string} title
 * @property {Task[]} tasks
 * @property {Layer[]} layers Inner pyramid, ordered from its base to its top.
 */

/** Ids come from the title path, so the JSON only needs titles. */
export function parse_layer(source, parent_id = '') {
  if (!source.title) throw new Error(`Layer without title under "${parent_id || 'root'}"`);
  const id = `${parent_id}/${source.title}`;
  return {
    id,
    title: source.title,
    tasks: (source.tasks ?? []).map((title) => ({ id: `${id}/${title}`, title })),
    layers: (source.layers ?? []).map((layer) => parse_layer(layer, id)),
  };
}

/** Tasks of the layer and of every layer in its inner pyramid. */
export function all_tasks(layer) {
  return [...layer.tasks, ...layer.layers.flatMap(all_tasks)];
}

export function count_checked(layer, checks) {
  return all_tasks(layer).filter((task) => is_checked(checks, task.id)).length;
}
