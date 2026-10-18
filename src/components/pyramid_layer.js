import { count_done } from '../models/layer.js';
import { is_done_on } from '../models/task.js';
import { escape_html } from '../services/escape_html.js';
import styles from './pyramid_layer.css.js';
import './pyramid_stack.js';

const task_template = (task, day) => /* html */ `
  <li class="${is_done_on(task, day) ? 'done' : ''}" data-task-id="${task.id}">
    <label>
      <input type="checkbox" ${is_done_on(task, day) ? 'checked' : ''}>
      <span>${escape_html(task.title)}</span>
    </label>
    <button type="button" class="remove" aria-label="Eliminar">×</button>
  </li>`;

const tasks_template = (layer, day) => /* html */ `
  <ul>${layer.tasks.map((task) => task_template(task, day)).join('')}</ul>
  <form>
    <input type="text" name="title" placeholder="Nueva tarea" required>
    <button type="submit" aria-label="Agregar">+</button>
  </form>`;

// A layer holding an inner pyramid shows that pyramid instead of its own task list.
const template = (layer, day) => /* html */ `
  <section>
    <header>
      <h2>${escape_html(layer.title)}</h2>
      ${layer.layers.length ? '' : `<span class="progress">${count_done(layer, day)}/${layer.tasks.length}</span>`}
    </header>
    ${layer.layers.length ? '<pyramid-stack></pyramid-stack>' : tasks_template(layer, day)}
  </section>`;

export class PyramidLayer extends HTMLElement {
  #layer;
  #depth;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [styles];
    this.shadowRoot.addEventListener('change', (event) => this.#on_change(event));
    this.shadowRoot.addEventListener('click', (event) => this.#on_click(event));
    this.shadowRoot.addEventListener('submit', (event) => this.#on_submit(event));
  }

  show(layer, day, depth) {
    this.#layer = layer;
    this.#depth = depth;
    this.shadowRoot.innerHTML = template(layer, day);
    this.shadowRoot.querySelector('pyramid-stack')?.show(layer.layers, day, depth + 1);
  }

  update(layer, day) {
    this.show(layer, day, this.#depth);
  }

  #on_change(event) {
    if (event.target.type !== 'checkbox') return;
    this.#emit('task-toggle', { task_id: this.#task_id_of(event.target) });
  }

  #on_click(event) {
    if (!event.target.matches('.remove')) return;
    this.#emit('task-remove', { task_id: this.#task_id_of(event.target) });
  }

  #on_submit(event) {
    event.preventDefault();
    const title = event.target.elements.title.value.trim();
    if (!title) return;
    this.#emit('task-add', { title });
    // The emit re-renders this layer synchronously, so keep typing in the fresh input.
    this.shadowRoot.querySelector('input[name="title"]').focus();
  }

  #task_id_of(element) {
    return element.closest('li').dataset.taskId;
  }

  #emit(name, detail) {
    const options = { detail: { layer_id: this.#layer.id, ...detail }, bubbles: true, composed: true };
    this.dispatchEvent(new CustomEvent(name, options));
  }
}

customElements.define('pyramid-layer', PyramidLayer);
