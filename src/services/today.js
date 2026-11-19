import { morning_start_hour } from './day_period.js';

/** The day starts in the morning, not at midnight, so a night routine finished after 00:00 keeps its checks. */
export function today() {
  const now = new Date();
  now.setHours(now.getHours() - morning_start_hour);
  return iso_day(now);
}

/** Local calendar day, so days follow the user's clock rather than UTC's. */
export function iso_day(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
