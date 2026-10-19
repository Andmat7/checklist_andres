import { create_daily_checks } from '../../models/daily_checks.js';

const storage_key = 'daily_checks';

export class ChecklistStore {
  load(day) {
    // Storage can be blocked (private mode); the checklist still works for the session.
    try {
      const saved = JSON.parse(localStorage.getItem(storage_key));
      return saved?.day === day ? saved : create_daily_checks(day);
    } catch {
      return create_daily_checks(day);
    }
  }

  save(checks) {
    try {
      localStorage.setItem(storage_key, JSON.stringify(checks));
    } catch {
      // Same reason as load: losing persistence must not break the page.
    }
  }
}
