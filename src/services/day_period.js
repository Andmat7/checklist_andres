/** @typedef {'day' | 'night'} DayPeriod */

const night_start_hour = 19;
// Staying up past midnight is still the night routine, so night lasts until early morning.
const morning_start_hour = 5;

const periods = ['day', 'night'];

/** @returns {DayPeriod} */
export function current_period() {
  // Lets either pyramid be tested at any hour via ?period=day or ?period=night.
  const requested_period = new URLSearchParams(location.search).get('period');
  if (periods.includes(requested_period)) return requested_period;
  const hour = new Date().getHours();
  return hour >= night_start_hour || hour < morning_start_hour ? 'night' : 'day';
}
