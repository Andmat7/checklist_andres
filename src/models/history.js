import { create_daily_checks } from './daily_checks.js';

/**
 * @typedef {import('./daily_checks.js').DailyChecks} DailyChecks
 * @typedef {Object<string, string[]>} History
 * Checked task ids by ISO day, e.g. { "2026-11-18": ["/Andres/Sueño 2/Agua"] }.
 */

export function create_history() {
  return {};
}

export function checks_of_day(history, day) {
  return { ...create_daily_checks(day), checked_task_ids: history[day] ?? [] };
}

export function record_day(history, daily_checks) {
  return { ...history, [daily_checks.day]: daily_checks.checked_task_ids };
}

/** Share of the given tasks checked that day; ids of renamed or removed tasks no longer count. */
export function completion(history, day, task_ids) {
  if (task_ids.length === 0) return 0;
  const checked = (history[day] ?? []).filter((task_id) => task_ids.includes(task_id));
  return checked.length / task_ids.length;
}
