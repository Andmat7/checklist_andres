import { toggle_check } from '../../models/checks.js';
import { create_daily_checks } from '../../models/daily_checks.js';
import { completed_layer_ids } from '../../models/layer.js';
import { ChecklistStore } from '../../services/storage/checklist_store.js';
import { current_period } from '../../services/day_period.js';
import { load_pyramid } from '../../services/pyramid_source.js';
import { today } from '../../services/today.js';
import styles from './pyramid_checklist.css.js';
import { VictoryFanfare } from './victory_fanfare.js';
import '../history_calendar/history_calendar.js';
import '../pyramid/pyramid_view.js';

const titles = { day: 'Mi pirámide de día', night: 'Mi pirámide de noche' };
const period_names = { day: 'día', night: 'noche' };
const other_period = current_period() === 'day' ? 'night' : 'day';

const template = /* html */ `
  <h1>${titles[current_period()]}</h1>
  <p></p>
  <a class="period_switch" href="?period=${other_period}">Ver pirámide de ${period_names[other_period]}</a>
  <pyramid-view></pyramid-view>
  <history-calendar></history-calendar>`;

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
    // Noon keeps the date from shifting with the time zone; before 5 a.m. it still reads as the previous day.
    subtitle.textContent = new Date(`${today()}T12:00`).toLocaleDateString('es', { dateStyle: 'full' });
    const file_name = `pyramid_${current_period()}.json`;
    try {
      this.#layers = await load_pyramid(file_name);
    } catch (error) {
      subtitle.textContent = `No se pudo cargar data/${file_name}`;
      throw error;
    }
    this.#render();
  }

  #render() {
    this.shadowRoot.querySelector('pyramid-view').show(this.#layers, this.#checks);
    this.shadowRoot.querySelector('history-calendar').show(this.#store.load_history());
  }

  #toggle(event) {
    const checks = this.#checks.day === today() ? this.#checks : create_daily_checks(today());
    const completed_before = completed_layer_ids(this.#layers, checks);
    this.#checks = toggle_check(checks, event.detail.task_id);
    this.#store.save(this.#checks);
    // Progress shows on every enclosing layer, so the whole pyramid redraws.
    this.#render();
    const completed_now = completed_layer_ids(this.#layers, this.#checks);
    if (completed_now.some((layer_id) => !completed_before.includes(layer_id))) this.#fanfare.play();
  }
}

customElements.define('pyramid-checklist', PyramidChecklist);
