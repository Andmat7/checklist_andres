import { is_silenced } from '../../models/reminder.js';
import { morning_start_hour } from '../day_period.js';
import { iso_day } from '../today.js';

/**
 * @typedef {Object} ScheduledNotification
 * @property {number} id Android needs a 32-bit integer; it encodes the day offset and the reminder.
 * @property {string} title
 * @property {string} body
 * @property {Date} at
 */

/** Notifications for the coming days; today's is dropped when its tasks are already checked. */
export function upcoming_notifications(reminders, checks, { now, days }) {
  return Array.from({ length: days }, (_, offset) => offset).flatMap((offset) => reminders
    .map((reminder, index) => ({ id: offset * 100 + index + 1, title: reminder.title, body: reminder.body, at: fire_time(now, offset, reminder.time), reminder }))
    .filter(({ at, reminder }) => at > now && !(checks.day === checklist_day(at) && is_silenced(reminder, checks)))
    .map(({ reminder, ...notification }) => notification));
}

function fire_time(now, offset, time) {
  const [hours, minutes] = time.split(':').map(Number);
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, hours, minutes);
}

/** Same rule as `today()`: before the morning starts it is still the previous checklist day. */
function checklist_day(date) {
  const shifted = new Date(date);
  shifted.setHours(shifted.getHours() - morning_start_hour);
  return iso_day(shifted);
}
