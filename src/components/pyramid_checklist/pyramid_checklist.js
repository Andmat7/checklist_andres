import { create_daily_checks, toggle_check } from '../../models/daily_checks.js';
import { ChecklistStore } from '../../services/checklist_store.js';
import { load_pyramid } from '../../services/pyramid_source.js';
import { today } from '../../services/today.js';
import styles from './pyramid_checklist.css.js';
import '../pyramid/pyramid_view.js';

const template = /* html */ `
  <h1>Mi pirámide diaria</h1>
  <p></p>
  <pyramid-view></pyramid-view>`;

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
    this.shadowRoot.querySelector('pyramid-view').show(this.#layers, this.#checks);
  }

  #toggle(event) {
    const checks = this.#checks.day === today() ? this.#checks : create_daily_checks(today());
    this.#checks = toggle_check(checks, event.detail.task_id);
    this.#store.save(this.#checks);
    // Progress shows on every enclosing layer, so the whole pyramid redraws.
    this.#render();
  }
}

customElements.define('pyramid-checklist', PyramidChecklist);
