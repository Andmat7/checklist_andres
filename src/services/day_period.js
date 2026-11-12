/** @typedef {'day' | 'night'} DayPeriod */

const night_start_hour = 19;
// Staying up past midnight is still the night routine, so night lasts until early morning.
const morning_start_hour = 5;

/** @returns {DayPeriod} */
export function current_period() {
  const hour = new Date().getHours();
  return hour >= night_start_hour || hour < morning_start_hour ? 'night' : 'day';
}
