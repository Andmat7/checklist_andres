const storage_key = 'ideas';

/** Ideas are kept newest first, e.g. [{ "created": "2026-11-27T11:40", "text": "Comprar urinal graduado" }]. */
export class IdeaStore {
  load() {
    // Storage can be blocked (private mode); the list still works for the session.
    try {
      const saved = JSON.parse(localStorage.getItem(storage_key));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  save(ideas) {
    try {
      localStorage.setItem(storage_key, JSON.stringify(ideas));
    } catch {
      // Same reason as load: losing persistence must not break the page.
    }
  }
}
