import { parse_reminder } from '../../models/reminder.js';
import { upcoming_notifications } from './reminder_schedule.js';

// A week ahead keeps reminders coming even if the app is not opened for a few days.
const days_ahead = 7;

/** Schedules the reminders as Android notifications; on the web there is no native bridge and it does nothing. */
export class NativeReminders {
  #reminders;

  async sync(checks) {
    const notifications = window.Capacitor?.isNativePlatform() ? window.Capacitor.Plugins.LocalNotifications : null;
    if (!notifications || !(await has_permission(notifications))) return;
    this.#reminders ??= await load_reminders();
    const pending = await notifications.getPending();
    if (pending.notifications.length) await notifications.cancel({ notifications: pending.notifications.map(({ id }) => ({ id })) });
    const upcoming = upcoming_notifications(this.#reminders, checks, { now: new Date(), days: days_ahead });
    await notifications.schedule({ notifications: upcoming.map(({ at, ...notification }) => ({ ...notification, schedule: { at, allowWhileIdle: true } })) });
  }
}

async function has_permission(notifications) {
  const { display } = await notifications.checkPermissions();
  if (display !== 'prompt' && display !== 'prompt-with-rationale') return display === 'granted';
  return (await notifications.requestPermissions()).display === 'granted';
}

async function load_reminders() {
  const response = await fetch(new URL('../../../data/reminders.json', import.meta.url));
  if (!response.ok) throw new Error(`Could not load reminders: ${response.status}`);
  return (await response.json()).reminders.map(parse_reminder);
}
