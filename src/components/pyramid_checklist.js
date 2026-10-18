import { create_daily_checks, toggle_check } from '../models/daily_checks.js';
import { ChecklistStore } from '../services/checklist_store.js';
import { load_pyramid } from '../services/pyramid_source.js';
import { today } from '../services/today.js';
import styles from './pyramid_checklist.css.js';
import './pyramid_stack.js';

const template = /* html */ `
  <h1>Mi pirámide diaria</h1>
  <p></p>
  <pyramid-stack></pyramid-stack>`;

export class PyramidChecklist extends HTMLElement {
  #store = new ChecklistStore();
  #checks = this.#store.load(today());
  #layers = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [styles];
    this.shadowRoot.innerHTML = template;
    this.shadowRoot.addEventListener('task-toggle', (event) => this.#toggle(event));
  }

  async connectedCallback() {
    const subtitle = this.shadowRoot.querySelector('p');
    subtitle.textContent = new Date().toLocaleDateString('es', { dateStyle: 'full' });
    try {
      this.#layers = await load_pyramid();
    } catch (error) {
      subtitle.textContent = 'No se pudo cargar data/pyramid.json';
      throw error;
    }
    this.#render();
  }

  #render() {
    this.shadowRoot.querySelector('pyramid-stack').show(this.#layers, this.#checks);
  }

  #toggle(event) {
    const is_new_day = this.#checks.day !== today();
    const checks = is_new_day ? create_daily_checks(today()) : this.#checks;
    this.#checks = toggle_check(checks, event.detail.task_id);
    this.#store.save(this.#checks);
    // A new day clears every layer, so redraw all of them; otherwise only the clicked one.
    if (is_new_day) this.#render();
    else event.composedPath()[0].update(this.#checks);
  }
}

customElements.define('pyramid-checklist', PyramidChecklist);
