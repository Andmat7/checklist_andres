import { create_checks, set_check } from './checks.js';

/**
 * @typedef {Object} TaskEntry
 * @property {string} time Local "HH:MM" when the task was done.
 * @property {string} [answer] Chosen option, only on tasks with options.
 * @property {Object<string, number>} [values] Numbers by input label, only on tasks with inputs.
 * @typedef {import('./checks.js').Checks & { day: string, entries: Object<string, TaskEntry>, starts: Object<string, string> }} DailyChecks
 * `day` is the ISO date the checks belong to; a new day starts empty. `starts` holds the local "HH:MM" when each
 * task was read, so the time from reading a task to doing it can be measured.
 */

export function create_daily_checks(day) {
  return { day, ...create_checks(), entries: {}, starts: {} };
}

/** Only the first start counts: tapping again later is not reading the task anew. */
export function start_task(daily_checks, task_id, time) {
  if (daily_checks.starts[task_id]) return daily_checks;
  return { ...daily_checks, starts: { ...daily_checks.starts, [task_id]: time } };
}

/** Checking again, or picking another option, overwrites the entry with the latest time. */
export function check_task(daily_checks, task_id, entry) {
  const entries = { ...daily_checks.entries, [task_id]: entry };
  return { ...set_check(daily_checks, task_id, true), entries };
}

/** The entry goes too, so the log only holds what was actually done; the start stays, since the task was read. */
export function uncheck_task(daily_checks, task_id) {
  const { [task_id]: removed_entry, ...entries } = daily_checks.entries;
  return { ...set_check(daily_checks, task_id, false), entries };
}
