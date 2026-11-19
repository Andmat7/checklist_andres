import { is_checked } from './checks.js';

/**
 * @typedef {Object} Reminder
 * @property {string} title
 * @property {string} body
 * @property {string} time Local "HH:MM" it fires every day.
 * @property {string[]} task_ids Tasks that silence it once all are checked that day.
 */

export function parse_reminder(source) {
  const { title, body, time, task_ids } = source;
  if (!title || !/^\d{2}:\d{2}$/.test(time ?? '') || !task_ids?.length) throw new Error(`Invalid reminder "${title}"`);
  return { title, body: body ?? '', time, task_ids };
}

export function is_silenced(reminder, checks) {
  return reminder.task_ids.every((task_id) => is_checked(checks, task_id));
}
