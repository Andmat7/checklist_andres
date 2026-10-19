/**
 * @typedef {Object} Task
 * @property {string} id Title path, e.g. "/Andres/Sueño/Dormir 7-8 horas".
 * @property {string} title
 * @property {number} [price] Only on things to buy, in pesos.
 */

/** In the JSON a task is a plain title, or `{ title, price }` when it is something to buy. */
export function parse_task(source, layer_id) {
  const { title, price } = typeof source === 'string' ? { title: source } : source;
  const task = { id: `${layer_id}/${title}`, title };
  return price === undefined ? task : { ...task, price };
}

export function total_price(tasks) {
  return tasks.reduce((sum, task) => sum + (task.price ?? 0), 0);
}
