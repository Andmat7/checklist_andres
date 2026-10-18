import { add_task, all_layers, remove_task, toggle_task, update_layer } from '../models/layer.js';
import { ChecklistStore } from '../services/checklist_store.js';
import { today } from '../services/today.js';
import styles from './pyramid_checklist.css.js';
import './pyramid_stack.js';

const template = /* html */ `
  <h1>Mi pirámide diaria</h1>
  <p></p>
  <pyramid-stack></pyramid-stack>`;

export class PyramidChecklist extends HTMLElement {
  #store = new ChecklistStore();
  #layers = this.#store.load();

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [styles];
    this.shadowRoot.innerHTML = template;
    this.#listen();
  }

  connectedCallback() {
    this.shadowRoot.querySelector('p').textContent = new Date().toLocaleDateString('es', { dateStyle: 'full' });
    this.shadowRoot.querySelector('pyramid-stack').show(this.#layers, today());
  }

  #listen() {
    const changes = {
      'task-add': (layer, detail) => add_task(layer, detail.title),
      'task-toggle': (layer, detail) => toggle_task(layer, detail.task_id, today()),
      'task-remove': (layer, detail) => remove_task(layer, detail.task_id),
    };
    for (const [name, change] of Object.entries(changes)) {
      this.shadowRoot.addEventListener(name, (event) => this.#apply(event, change));
    }
  }

  #apply(event, change) {
    const { layer_id } = event.detail;
    this.#layers = update_layer(this.#layers, layer_id, (layer) => change(layer, event.detail));
    this.#store.save(this.#layers);
    const updated = all_layers(this.#layers).find((layer) => layer.id === layer_id);
    // Re-render only the emitting layer so the rest of the pyramid keeps its focus and scroll.
    event.composedPath()[0].update(updated, today());
  }
}

customElements.define('pyramid-checklist', PyramidChecklist);
