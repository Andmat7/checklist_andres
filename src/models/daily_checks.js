/**
 * @typedef {Object} DailyChecks
 * @property {string} day ISO date the checks belong to; a new day starts empty.
 * @property {string[]} checked_task_ids
 */

export function create_daily_checks(day) {
  return { day, checked_task_ids: [] };
}

export function is_checked(checks, task_id) {
  return checks.checked_task_ids.includes(task_id);
}

export function toggle_check(checks, task_id) {
  const checked_task_ids = is_checked(checks, task_id)
    ? checks.checked_task_ids.filter((checked_id) => checked_id !== task_id)
    : [...checks.checked_task_ids, task_id];
  return { ...checks, checked_task_ids };
}
