import { toggle_check } from '../../models/checks.js';
import { create_daily_checks } from '../../models/daily_checks.js';
import { completed_pyramid_ids } from '../../models/layer.js';
import { ChecklistStore } from '../../services/storage/checklist_store.js';
import { load_pyramid } from '../../services/pyramid_source.js';
import { today } from '../../services/today.js';
import styles from './pyramid_checklist.css.js';
import { VictoryFanfare } from './victory_fanfare.js';
import '../pyramid/pyramid_view.js';

const template = /* html */ `
  <h1>Mi pirámide diaria</h1>
  <p></p>
  <pyramid-view></pyramid-view>`;

export class PyramidChecklist extends HTMLElement {
  #store = new ChecklistStore();
  #checks = this.#store.load(today());
  #layers = [];
  #fanfare = new VictoryFanfare();

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
      this.#layers = await load_pyramid('pyramid.json');
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
    const completed_before = completed_pyramid_ids(this.#layers, checks);
    this.#checks = toggle_check(checks, event.detail.task_id);
    this.#store.save(this.#checks);
    // Progress shows on every enclosing layer, so the whole pyramid redraws.
    this.#render();
    const completed_now = completed_pyramid_ids(this.#layers, this.#checks);
    if (completed_now.some((pyramid_id) => !completed_before.includes(pyramid_id))) this.#fanfare.play();
  }
}

customElements.define('pyramid-checklist', PyramidChecklist);
