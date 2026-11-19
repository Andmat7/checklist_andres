/**
 * @typedef {Object} Task
 * @property {string} id Title path, e.g. "/Andres/Sueño/Dormir 7-8 horas".
 * @property {string} title
 * @property {number} [price] Only on things to buy, in pesos.
 * @property {string[]} [options] Answers to log instead of a checkbox; the first one means it was not done.
 */

/** In the JSON a task is a plain title, `{ title, price }` when it is something to buy, or `{ title, options }` to log an answer. */
export function parse_task(source, layer_id) {
  const { title, price, options } = typeof source === 'string' ? { title: source } : source;
  const task = { id: `${layer_id}/${title}`, title };
  return { ...task, ...(price === undefined ? {} : { price }), ...(options === undefined ? {} : { options }) };
}

export function total_price(tasks) {
  return tasks.reduce((sum, task) => sum + (task.price ?? 0), 0);
}
