import { completion } from '../../models/history.js';
import { all_tasks } from '../../models/layer.js';
import { load_pyramid } from '../../services/pyramid_source.js';
import { iso_day, today } from '../../services/today.js';
import { download_json } from './download_json.js';
import styles from './history_calendar.css.js';

const weeks_shown = 5;
const weekday_names = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const pyramid_files = ['pyramid_day.json', 'pyramid_night.json'];

const template = /* html */ `
  <h2>Historial</h2>
  <div class="grid">
    ${weekday_names.map((name) => `<span class="weekday">${name}</span>`).join('')}
  </div>
  <button type="button">Descargar historial</button>`;

/** One square per day, brighter the more of both pyramids was checked; the export takes every day ever saved, with times. */
export class HistoryCalendar extends HTMLElement {
  #history = {};
  #entries = {};
  #task_ids = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [styles];
    this.shadowRoot.innerHTML = template;
    this.shadowRoot.querySelector('button').addEventListener('click', () => download_json({ checks: this.#history, entries: this.#entries }, `historial_${today()}.json`));
  }

  async connectedCallback() {
    const pyramids = await Promise.all(pyramid_files.map((file_name) => load_pyramid(file_name)));
    this.#task_ids = pyramids.flat().flatMap(all_tasks).map((task) => task.id);
    this.#render();
  }

  /** `entries` holds the time and answer of each task, exported with the checks for later analysis. */
  show(history, entries) {
    this.#history = history;
    this.#entries = entries;
    this.#render();
  }

  #render() {
    const grid = this.shadowRoot.querySelector('.grid');
    grid.querySelectorAll('.day').forEach((cell) => cell.remove());
    grid.append(...calendar_days(today()).map((day) => this.#day_cell(day)));
  }

  #day_cell(day) {
    const cell = document.createElement('span');
    const percent = Math.round(completion(this.#history, day, this.#task_ids) * 100);
    cell.className = 'day';
    cell.classList.toggle('today', day === today());
    cell.classList.toggle('future', day > today());
    cell.style.setProperty('--done', `${percent}%`);
    cell.title = `${day}: ${percent}%`;
    return cell;
  }
}

/** Whole weeks from Monday, so each weekday stays in its column; days after today are kept as blanks. */
function calendar_days(last_day) {
  const last = new Date(`${last_day}T12:00`);
  const days_to_sunday = 6 - (last.getDay() + 6) % 7;
  const total = weeks_shown * weekday_names.length;
  return Array.from({ length: total }, (_, index) => {
    const date = new Date(last);
    date.setDate(last.getDate() + days_to_sunday - (total - 1 - index));
    return iso_day(date);
  });
}

customElements.define('history-calendar', HistoryCalendar);
