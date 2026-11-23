/**
 * @typedef {Object} Task
 * @property {string} id Title path, e.g. "/Andres/Sueño/Dormir 7-8 horas".
 * @property {string} title
 * @property {number} [price] Only on things to buy, in pesos.
 * @property {string[]} [options] Answers to log instead of a checkbox; the first one means it was not done.
 * @property {string[]} [inputs] Labels of numbers to log instead of a checkbox, e.g. a blood pressure reading.
 * @property {string} [note] How to do it, shown under the title, e.g. when and how to weigh in so weighings compare.
 * @property {boolean} [optional] Counts when done but never holds back a layer, so skipping it carries no pressure.
 * @property {string} [skip_label] Only on tasks with inputs: a box to check instead of the numbers, e.g. "No la tomé".
 * @property {boolean} [timed] Shows a start button first, so the time from reading the task to doing it is measured.
 * @property {string} [skip_if_logged_last_night] Id of a night task; when it was logged last night this morning review is hidden.
 */

/** In the JSON a task is a plain title, `{ title, price }` when it is something to buy, `{ title, options }` to log an answer, or `{ title, inputs }` to log numbers; any of them may add a `note`, `optional: true`, `skip_label`, `timed: true` or `skip_if_logged_last_night`. */
export function parse_task(source, layer_id) {
  const { title, ...fields } = typeof source === 'string' ? { title: source } : source;
  return { id: `${layer_id}/${title}`, title, ...defined_fields(fields) };
}

function defined_fields(fields) {
  return Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined && value !== false));
}

export function total_price(tasks) {
  return tasks.reduce((sum, task) => sum + (task.price ?? 0), 0);
}
