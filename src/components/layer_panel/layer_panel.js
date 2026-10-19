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

const task_template = (task, checks) => /* html */ `
  <li class="${is_checked(checks, task.id) ? 'done' : ''}">
    <label>
      <input type="checkbox" data-task-id="${escape_html(task.id)}" ${is_checked(checks, task.id) ? 'checked' : ''}>
      <span>${escape_html(task.title)}</span>
      ${task.price === undefined ? '' : `<span class="price">${format_price(task.price)}</span>`}
    </label>
  </li>`;

/** Shows the selected layer's tasks; emits `task-toggle` when one is checked or unchecked. */
export class LayerPanel extends HTMLElement {
  #layer;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [styles];
    this.shadowRoot.addEventListener('change', (event) => this.#on_change(event));
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
    if (event.target.type !== 'checkbox') return;
    const options = { detail: this.#toggle_detail(event.target), bubbles: true, composed: true };
    this.dispatchEvent(new CustomEvent('task-toggle', options));
    // The toggle re-renders the list synchronously, so restore keyboard focus on the same task.
    this.shadowRoot.querySelector(`[data-task-id="${CSS.escape(event.target.dataset.taskId)}"]`)?.focus();
  }

  /** Read before the re-render: where the checkbox sits and whether it completed the layer drive the sparkles. */
  #toggle_detail(checkbox) {
    const bounds = checkbox.getBoundingClientRect();
    const checkboxes = [...this.shadowRoot.querySelectorAll('ul input[type="checkbox"]')];
    return {
      task_id: checkbox.dataset.taskId,
      checked: checkbox.checked,
      origin: { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 },
      color: getComputedStyle(this).getPropertyValue('--layer-color').trim(),
      layer_complete: checkboxes.every((box) => box.checked),
    };
  }
}

customElements.define('layer-panel', LayerPanel);
