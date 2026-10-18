import { is_checked } from '../models/daily_checks.js';
import { count_checked } from '../models/layer.js';
import { escape_html } from '../services/escape_html.js';
import styles from './pyramid_layer.css.js';
import './pyramid_stack.js';

const task_template = (task, checks) => /* html */ `
  <li class="${is_checked(checks, task.id) ? 'done' : ''}">
    <label>
      <input type="checkbox" data-task-id="${escape_html(task.id)}" ${is_checked(checks, task.id) ? 'checked' : ''}>
      <span>${escape_html(task.title)}</span>
    </label>
  </li>`;

// A layer holding an inner pyramid shows that pyramid; a leaf layer shows its tasks.
const template = (layer, checks) => /* html */ `
  <section>
    <header>
      <h2>${escape_html(layer.title)}</h2>
      ${layer.tasks.length ? `<span class="progress">${count_checked(layer, checks)}/${layer.tasks.length}</span>` : ''}
    </header>
    ${layer.layers.length ? '<pyramid-stack></pyramid-stack>' : ''}
    ${layer.tasks.length ? `<ul>${layer.tasks.map((task) => task_template(task, checks)).join('')}</ul>` : ''}
  </section>`;

export class PyramidLayer extends HTMLElement {
  #layer;
  #depth;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [styles];
    this.shadowRoot.addEventListener('change', (event) => this.#on_change(event));
  }

  show(layer, checks, depth) {
    this.#layer = layer;
    this.#depth = depth;
    this.shadowRoot.innerHTML = template(layer, checks);
    this.shadowRoot.querySelector('pyramid-stack')?.show(layer.layers, checks, depth + 1);
  }

  update(checks) {
    this.show(this.#layer, checks, this.#depth);
  }

  #on_change(event) {
    if (event.target.type !== 'checkbox') return;
    const options = { detail: { task_id: event.target.dataset.taskId }, bubbles: true, composed: true };
    this.dispatchEvent(new CustomEvent('task-toggle', options));
    // The toggle re-renders this layer synchronously, so restore keyboard focus on the same task.
    this.shadowRoot.querySelector(`[data-task-id="${CSS.escape(event.target.dataset.taskId)}"]`)?.focus();
  }
}

customElements.define('pyramid-layer', PyramidLayer);
