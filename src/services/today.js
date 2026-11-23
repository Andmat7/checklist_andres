import { morning_start_hour } from './day_period.js';

/** The day starts in the morning, not at midnight, so a night routine finished after 00:00 keeps its checks. */
export function today() {
  const now = new Date();
  now.setHours(now.getHours() - morning_start_hour);
  return iso_day(now);
}

/** The day before today(), whose checks hold last night's routine. */
export function yesterday() {
  const date = new Date(`${today()}T12:00`);
  date.setDate(date.getDate() - 1);
  return iso_day(date);
}

/** Local "HH:MM", the precision needed to see when each task gets done. */
export function clock_time(date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

/** Local calendar day, so days follow the user's clock rather than UTC's. */
export function iso_day(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
