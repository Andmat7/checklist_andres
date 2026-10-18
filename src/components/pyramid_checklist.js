import { add_task, remove_task, toggle_task } from '../models/layer.js';
import { ChecklistStore } from '../services/checklist_store.js';
import { today } from '../services/today.js';
import styles from './pyramid_checklist.css.js';
import './pyramid_layer.js';

const template = /* html */ `
  <h1>Mi pirámide diaria</h1>
  <p></p>
  <div class="pyramid"></div>`;

const layer_hues = [210, 150, 35];

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
    const top_first = [...this.#layers].reverse();
    const elements = top_first.map((layer, position) => this.#create_layer(layer, position));
    this.shadowRoot.querySelector('.pyramid').replaceChildren(...elements);
  }

  #listen() {
    const changes = {
      'task-add': (layer, detail) => add_task(layer, detail.title),
      'task-toggle': (layer, detail) => toggle_task(layer, detail.task_id, today()),
      'task-remove': (layer, detail) => remove_task(layer, detail.task_id),
    };
    for (const [name, change] of Object.entries(changes)) {
      this.shadowRoot.addEventListener(name, (event) => this.#update_layer(event.detail, change));
    }
  }

  #update_layer(detail, change) {
    this.#layers = this.#layers.map((layer) => (layer.id === detail.layer_id ? change(layer, detail) : layer));
    this.#store.save(this.#layers);
    const updated = this.#layers.find((layer) => layer.id === detail.layer_id);
    this.shadowRoot.querySelector(`[data-layer-id="${detail.layer_id}"]`).show(updated, today());
  }

  #create_layer(layer, position) {
    const element = document.createElement('pyramid-layer');
    const layer_count = this.#layers.length;
    // Narrower toward the top so the stack reads as a pyramid.
    element.style.setProperty('--layer-width', `${60 + (40 * (position + 1)) / layer_count}%`);
    element.style.setProperty('--layer-hue', layer_hues[(layer_count - 1 - position) % layer_hues.length]);
    element.dataset.layerId = layer.id;
    element.show(layer, today());
    return element;
  }
}

customElements.define('pyramid-checklist', PyramidChecklist);
