import { create_checks } from './checks.js';

/**
 * @typedef {import('./checks.js').Checks & { day: string }} DailyChecks
 * `day` is the ISO date the checks belong to; a new day starts empty.
 */

export function create_daily_checks(day) {
  return { day, ...create_checks() };
}
