import { default_layers, merge_saved } from '../models/layer.js';

const storage_key = 'pyramid_checklist';

export class ChecklistStore {
  load() {
    // Storage can be blocked (private mode); the checklist still works for the session.
    try {
      return merge_saved(default_layers, JSON.parse(localStorage.getItem(storage_key) ?? '[]'));
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
