import { create_shopping_list } from '../../models/shopping_list.js';

const storage_key = 'shopping_list';

/** Unlike the daily checks, the list survives midnight: it lasts until a new list is started. */
export class ShoppingStore {
  load() {
    // Storage can be blocked (private mode); the list still works for the session.
    try {
      const saved = JSON.parse(localStorage.getItem(storage_key));
      return saved?.needed && saved?.bought ? saved : create_shopping_list();
    } catch {
      return create_shopping_list();
    }
  }

  save(list) {
    try {
      localStorage.setItem(storage_key, JSON.stringify(list));
    } catch {
      // Same reason as load: losing persistence must not break the page.
    }
  }
}
