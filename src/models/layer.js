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

export function count_checked(layer, checks) {
  return layer.tasks.filter((task) => is_checked(checks, task.id)).length;
}
