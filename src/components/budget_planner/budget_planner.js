import { all_tasks } from '../../models/layer.js';
import { create_shopping_list, marked_tasks, needed_layers, toggle_bought, toggle_needed } from '../../models/shopping_list.js';
import { total_price } from '../../models/task.js';
import { format_price } from '../../services/money.js';
import { load_pyramid } from '../../services/pyramid_source.js';
import { ShoppingStore } from '../../services/storage/shopping_store.js';
import styles from './budget_planner.css.js';
import '../pyramid/pyramid_view.js';

const template = /* html */ `
  <h1>Presupuesto</h1>
  <p class="total"></p>
  <div class="modes">
    <button type="button" data-mode="checking">1. ¿Qué falta?</button>
    <button type="button" data-mode="shopping">2. De compras</button>
  </div>
  <p class="summary"></p>
  <p class="empty">Nada por comprar. Marca primero lo que falta en casa.</p>
  <pyramid-view></pyramid-view>
  <button type="button" class="restart">Empezar una lista nueva</button>`;

/** Two passes over one pyramid: first mark what is missing at home, then buy it store by store. */
export class BudgetPlanner extends HTMLElement {
  #store = new ShoppingStore();
  #list = this.#store.load();
  #layers = [];
  #mode = 'checking';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [styles];
    this.shadowRoot.innerHTML = template;
    this.shadowRoot.addEventListener('task-toggle', (event) => this.#toggle(event));
    this.shadowRoot.querySelector('.modes').addEventListener('click', (event) => this.#switch_mode(event));
    this.shadowRoot.querySelector('.restart').addEventListener('click', () => this.#restart());
  }

  async connectedCallback() {
    try {
      this.#layers = await load_pyramid('budget.json');
    } catch (error) {
      this.shadowRoot.querySelector('.summary').textContent = 'No se pudo cargar data/budget.json';
      throw error;
    }
    this.#render();
  }

  #render() {
    const is_shopping = this.#mode === 'shopping';
    const layers = is_shopping ? needed_layers(this.#layers, this.#list) : this.#layers;
    this.shadowRoot.querySelector('pyramid-view').show(layers, is_shopping ? this.#list.bought : this.#list.needed);
    this.shadowRoot.querySelector('pyramid-view').hidden = layers.length === 0;
    this.shadowRoot.querySelector('.empty').hidden = layers.length > 0;
    this.shadowRoot.querySelector('.restart').hidden = !is_shopping || layers.length === 0;
    this.shadowRoot.querySelectorAll('.modes button').forEach((button) => button.setAttribute('aria-pressed', button.dataset.mode === this.#mode));
    this.shadowRoot.querySelector('.total').textContent = `Mensual: ${format_price(total_price(this.#layers.flatMap(all_tasks)))}`;
    this.shadowRoot.querySelector('.summary').textContent = this.#summary();
  }

  #summary() {
    const needed = marked_tasks(this.#layers, this.#list.needed);
    if (this.#mode === 'checking') return `Faltan ${needed.length} · ${format_price(total_price(needed))}`;
    const bought = marked_tasks(this.#layers, this.#list.bought);
    return `Comprado ${format_price(total_price(bought))} de ${format_price(total_price(needed))}`;
  }

  #toggle(event) {
    const task_id = event.detail.task_id;
    // Sparkles celebrate purchases, not finding out something is missing.
    if (this.#mode === 'checking') event.stopPropagation();
    this.#list = this.#mode === 'checking' ? toggle_needed(this.#list, task_id) : toggle_bought(this.#list, task_id);
    this.#store.save(this.#list);
    this.#render();
  }

  #switch_mode(event) {
    const button = event.target.closest('button[data-mode]');
    if (!button) return;
    this.#mode = button.dataset.mode;
    this.#render();
  }

  #restart() {
    if (!confirm('¿Borrar la lista actual y empezar otra?')) return;
    this.#list = create_shopping_list();
    this.#store.save(this.#list);
    this.#mode = 'checking';
    this.#render();
  }
}

customElements.define('budget-planner', BudgetPlanner);
