import { default_layers } from '../models/layer.js';

const storage_key = 'pyramid_checklist';

export class ChecklistStore {
  load() {
    // Storage can be blocked (private mode); the checklist still works for the session.
    try {
      const saved = localStorage.getItem(storage_key);
      return saved ? JSON.parse(saved) : structuredClone(default_layers);
    } catch {
      return structuredClone(default_layers);
    }
  }

  save(layers) {
    try {
      localStorage.setItem(storage_key, JSON.stringify(layers));
    } catch {
      // Same reason as load: losing persistence must not break the page.
    }
  }
}
