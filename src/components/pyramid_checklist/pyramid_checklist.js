import { check_task, create_daily_checks, start_task, uncheck_task } from '../../models/daily_checks.js';
import { completed_layer_ids, filter_layers } from '../../models/layer.js';
import { is_checked } from '../../models/checks.js';
import { ChecklistStore } from '../../services/storage/checklist_store.js';
import { current_period } from '../../services/day_period.js';
import { load_pyramid } from '../../services/pyramid_source.js';
import { NativeReminders } from '../../services/reminders/native_reminders.js';
import { clock_time, today, yesterday } from '../../services/today.js';
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
  #reminders = new NativeReminders();

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [styles];
    this.shadowRoot.innerHTML = template;
    this.shadowRoot.addEventListener('task-toggle', (event) => this.#toggle(event));
    this.shadowRoot.addEventListener('task-start', (event) => this.#start(event.detail.task_id));
  }

  async connectedCallback() {
    const subtitle = this.shadowRoot.querySelector('p');
    // Noon keeps the date from shifting with the time zone; before 5 a.m. it still reads as the previous day.
    subtitle.textContent = new Date(`${today()}T12:00`).toLocaleDateString('es', { dateStyle: 'full' });
    const file_name = `pyramid_${current_period()}.json`;
    try {
      this.#layers = this.#without_reviews_done_last_night(await load_pyramid(file_name));
    } catch (error) {
      subtitle.textContent = `No se pudo cargar data/${file_name}`;
      throw error;
    }
    this.#render();
    this.#sync_reminders();
  }

  /** A morning review only covers what last night's pyramid missed, so answering it twice is not asked. */
  #without_reviews_done_last_night(layers) {
    const last_night = this.#store.load(yesterday());
    return filter_layers(layers, (task) => !task.skip_if_logged_last_night || !is_checked(last_night, task.skip_if_logged_last_night));
  }

  #render() {
    this.shadowRoot.querySelector('pyramid-view').show(this.#layers, this.#checks);
    this.shadowRoot.querySelector('history-calendar').show(this.#store.load_history(), this.#store.load_entries(), this.#store.load_starts());
  }

  #start(task_id) {
    const checks = this.#checks.day === today() ? this.#checks : create_daily_checks(today());
    this.#checks = start_task(checks, task_id, clock_time(new Date()));
    this.#store.save(this.#checks);
    this.#render();
  }

  #toggle(event) {
    const checks = this.#checks.day === today() ? this.#checks : create_daily_checks(today());
    const completed_before = completed_layer_ids(this.#layers, checks);
    this.#checks = apply_toggle(checks, event.detail);
    this.#store.save(this.#checks);
    // Progress shows on every enclosing layer, so the whole pyramid redraws.
    this.#render();
    const completed_now = completed_layer_ids(this.#layers, this.#checks);
    if (completed_now.some((layer_id) => !completed_before.includes(layer_id))) this.#fanfare.play();
    this.#sync_reminders();
  }

  /** A reminder is a nudge, so failing to schedule it only warns and the checklist keeps working. */
  #sync_reminders() {
    this.#reminders.sync(this.#checks).catch((error) => console.warn('Reminders disabled:', error));
  }
}

/** Every check is stamped with the time, so the daily routine can be reviewed later. */
function apply_toggle(checks, { task_id, checked, answer, values }) {
  if (!checked) return uncheck_task(checks, task_id);
  const time = clock_time(new Date());
  return check_task(checks, task_id, { time, ...(answer === undefined ? {} : { answer }), ...(values === undefined ? {} : { values }) });
}

customElements.define('pyramid-checklist', PyramidChecklist);
