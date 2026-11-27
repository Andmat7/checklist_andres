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
 * @property {{ task: string, answer: string }} [skip_if_answered] Hides the task while another task of today holds that answer, e.g. no reason to give when nothing woke you.
 */

/** In the JSON a task is a plain title, `{ title, price }` when it is something to buy, `{ title, options }` to log an answer, or `{ title, inputs }` to log numbers; any of them may add a `note`, `optional: true`, `skip_label`, `timed: true`, `skip_if_logged_last_night` or `skip_if_answered`. */
export function parse_task(source, layer_id) {
  const { title, ...fields } = typeof source === 'string' ? { title: source } : source;
  return { id: `${layer_id}/${title}`, title, ...defined_fields(fields) };
}

function defined_fields(fields) {
  return Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined && value !== false));
}

/** @param {Task} task @param {import('./checks.js').Checks} checks */
export function is_skipped_by_answer(task, checks) {
  return Boolean(task.skip_if_answered) && checks.entries?.[task.skip_if_answered.task]?.answer === task.skip_if_answered.answer;
}

export function total_price(tasks) {
  return tasks.reduce((sum, task) => sum + (task.price ?? 0), 0);
}
