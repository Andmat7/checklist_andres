import { checks_of_day, create_history, record_day } from '../../models/history.js';

const storage_key = 'checks_history';
// Before the history existed only the current day was kept, under this key; it is folded in on the next save.
const legacy_key = 'daily_checks';

/** Every day is kept, so past days can be shown and exported. */
export class ChecklistStore {
  load(day) {
    return checks_of_day(this.load_history(), day);
  }

  load_history() {
    // Storage can be blocked (private mode); the checklist still works for the session.
    try {
      const history = JSON.parse(localStorage.getItem(storage_key)) ?? create_history();
      const legacy = JSON.parse(localStorage.getItem(legacy_key));
      return legacy?.day && !history[legacy.day] ? record_day(history, legacy) : history;
    } catch {
      return create_history();
    }
  }

  save(checks) {
    try {
      localStorage.setItem(storage_key, JSON.stringify(record_day(this.load_history(), checks)));
      localStorage.removeItem(legacy_key);
    } catch {
      // Same reason as load: losing persistence must not break the page.
    }
  }
}
