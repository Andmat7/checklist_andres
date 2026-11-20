import { is_checked } from '../../models/checks.js';
import { escape_html } from '../../services/escape_html.js';
import { format_price } from '../../services/money.js';
import styles from './layer_panel.css.js';
import '../pyramid/pyramid_view.js';

const hint_template = /* html */ `<p class="hint">Toca una capa para ver sus tareas</p>`;

// A layer holding an inner pyramid shows that pyramid; a leaf layer shows its tasks.
const template = (layer) => /* html */ `
  <section>
    <h2>${escape_html(layer.title)}</h2>
    ${layer.tasks.length ? '<ul></ul>' : ''}
    ${layer.layers.length ? '<pyramid-view></pyramid-view>' : ''}
  </section>`;

const title_template = (task) => /* html */ `
  <span>${escape_html(task.title)}${task.note ? `<small class="note">${escape_html(task.note)}</small>` : ''}</span>`;

const task_template = (task, checks) => {
  if (task.options) return answer_template(task, checks);
  return task.inputs ? numbers_template(task, checks) : checkbox_template(task, checks);
};

// Tapped when the task is read; it then shows that time, and checking the task stamps when it was done.
// Shopping lists carry no starts, so they get no button.
const start_template = (task, checks) => {
  if (!checks.starts) return '';
  const started = checks.starts[task.id];
  const label = started ? `Leída a las ${started}` : `Empezar ${escape_html(task.title)}`;
  return /* html */ `
    <button type="button" class="start" data-start-id="${escape_html(task.id)}" ${started ? 'disabled' : ''} aria-label="${label}">${started ?? '▶'}</button>`;
};

// Starting and completing happen in order: a task is completed only after it was started, so every done task has
// both times. Tasks checked before starts existed stay editable so they can be unchecked.
const is_locked = (task, checks) => checks.starts !== undefined && !checks.starts[task.id] && !is_checked(checks, task.id);
const lock = (task, checks) => (is_locked(task, checks) ? 'disabled' : '');

const numbers_template = (task, checks) => /* html */ `
  <li class="numbers">
    ${start_template(task, checks)}
    ${title_template(task)}
    <span class="fields">
      ${task.inputs.map((label) => number_template(task, label, checks)).join('')}
    </span>
  </li>`;

// The decimal keypad, since a weight like 98.6 needs the point that the numeric one lacks on Android.
const number_template = (task, label, checks) => /* html */ `
  <input type="number" inputmode="decimal" min="0" step="any" data-task-id="${escape_html(task.id)}" data-label="${escape_html(label)}"
    placeholder="${escape_html(label)}" aria-label="${escape_html(label)}" value="${checks.entries?.[task.id]?.values?.[label] ?? ''}" ${lock(task, checks)}>`;

// Shopping checks carry no entries, so the first option is the fallback answer.
const answer_template = (task, checks) => /* html */ `
  <li class="answer">
    ${start_template(task, checks)}
    <label>
      ${title_template(task)}
      <select data-task-id="${escape_html(task.id)}" ${lock(task, checks)}>
        ${task.options.map((option) => option_template(option, checks.entries?.[task.id]?.answer ?? task.options[0])).join('')}
      </select>
    </label>
  </li>`;

const option_template = (option, answer) => /* html */ `
  <option ${option === answer ? 'selected' : ''}>${escape_html(option)}</option>`;

const checkbox_template = (task, checks) => /* html */ `
  <li class="${is_checked(checks, task.id) ? 'done' : ''}">
    ${start_template(task, checks)}
    <label>
      <input type="checkbox" data-task-id="${escape_html(task.id)}" ${is_checked(checks, task.id) ? 'checked' : ''} ${lock(task, checks)}>
      ${title_template(task)}
      ${task.price === undefined ? '' : `<span class="price">${format_price(task.price)}</span>`}
    </label>
  </li>`;

/** Shows the selected layer's tasks; emits `task-start` when one is read and `task-toggle` when one is checked or unchecked. */
export class LayerPanel extends HTMLElement {
  #layer;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [styles];
    this.shadowRoot.addEventListener('change', (event) => this.#on_change(event));
    this.shadowRoot.addEventListener('click', (event) => this.#on_start(event));
  }

  show(layer, checks, { depth, color }) {
    // Rebuilding only on a new layer keeps the inner pyramid's own selection across check updates.
    if (layer?.id !== this.#layer?.id || !this.shadowRoot.firstChild) {
      this.shadowRoot.innerHTML = layer ? template(layer) : hint_template;
    }
    this.#layer = layer;
    if (!layer) return;
    this.style.setProperty('--layer-color', color);
    const list = this.shadowRoot.querySelector('ul');
    if (list) list.innerHTML = layer.tasks.map((task) => task_template(task, checks)).join('');
    this.shadowRoot.querySelector('pyramid-view')?.show(layer.layers, checks, depth + 1);
  }

  #on_change(event) {
    if (!event.target.dataset.taskId) return;
    const fields = this.#task_fields(event.target);
    // A half-typed reading waits for the rest; a re-render now would wipe what was typed.
    if (fields.some(is_done) && !fields.every(is_done)) return;
    const options = { detail: this.#toggle_detail(event.target), bubbles: true, composed: true };
    this.dispatchEvent(new CustomEvent('task-toggle', options));
    // The toggle re-renders the list synchronously, so restore keyboard focus on the same task; a number
    // field only changes on blur, when focus has already moved on, so it is left alone.
    if (event.target.type !== 'number') this.shadowRoot.querySelector(`[data-task-id="${CSS.escape(event.target.dataset.taskId)}"]`)?.focus();
  }

  #on_start(event) {
    const button = event.target.closest('[data-start-id]');
    if (!button || button.disabled) return;
    this.dispatchEvent(new CustomEvent('task-start', { detail: { task_id: button.dataset.startId }, bubbles: true, composed: true }));
  }

  #task_fields(input) {
    return [...this.shadowRoot.querySelectorAll(`ul [data-task-id="${CSS.escape(input.dataset.taskId)}"]`)];
  }

  /** Read before the re-render: where the input sits and whether it completed the layer drive the sparkles. */
  #toggle_detail(input) {
    const bounds = input.getBoundingClientRect();
    const inputs = [...this.shadowRoot.querySelectorAll('ul [data-task-id]')];
    return {
      task_id: input.dataset.taskId,
      checked: this.#task_fields(input).every(is_done),
      ...(input.tagName === 'SELECT' ? { answer: input.value } : {}),
      ...(input.type === 'number' ? { values: field_values(this.#task_fields(input)) } : {}),
      origin: { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 },
      color: getComputedStyle(this).getPropertyValue('--layer-color').trim(),
      layer_complete: inputs.every(is_done),
    };
  }
}

/** The first option of a select means "not done", so leaving it untouched never counts as an answer. */
function is_done(input) {
  if (input.tagName === 'SELECT') return input.selectedIndex > 0;
  return input.type === 'number' ? input.value !== '' : input.checked;
}

function field_values(fields) {
  return Object.fromEntries(fields.map((field) => [field.dataset.label, Number(field.value)]));
}

customElements.define('layer-panel', LayerPanel);
