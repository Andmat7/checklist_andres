/**
 * @typedef {Object} Task
 * @property {string} id Title path, e.g. "/Andres/Sueño/Dormir 7-8 horas".
 * @property {string} title
 * @property {number} [price] Only on things to buy, in pesos.
 * @property {string[]} [options] Answers to log instead of a checkbox; the first one means it was not done.
 * @property {string[]} [inputs] Labels of numbers to log instead of a checkbox, e.g. a blood pressure reading.
 * @property {string} [note] How to do it, shown under the title, e.g. when and how to weigh in so weighings compare.
 * @property {boolean} [optional] Counts when done but never holds back a layer, so skipping it carries no pressure.
 */

/** In the JSON a task is a plain title, `{ title, price }` when it is something to buy, `{ title, options }` to log an answer, or `{ title, inputs }` to log numbers; any of them may add a `note` or `optional: true`. */
export function parse_task(source, layer_id) {
  const { title, price, options, inputs, note, optional } = typeof source === 'string' ? { title: source } : source;
  const task = { id: `${layer_id}/${title}`, title };
  return { ...task, ...(price === undefined ? {} : { price }), ...(options === undefined ? {} : { options }), ...(inputs === undefined ? {} : { inputs }), ...(note === undefined ? {} : { note }), ...(optional ? { optional } : {}) };
}

export function total_price(tasks) {
  return tasks.reduce((sum, task) => sum + (task.price ?? 0), 0);
}
