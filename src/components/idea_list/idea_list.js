import { escape_html } from '../../services/escape_html.js';
import { IdeaStore } from '../../services/storage/idea_store.js';
import styles from './idea_list.css.js';

const template = /* html */ `
  <h1>Ideas</h1>
  <form>
    <input type="text" name="idea" placeholder="Escribe una idea…" aria-label="Idea nueva" autocomplete="off" required>
    <button type="submit">Guardar</button>
  </form>
  <ul></ul>`;

/** Catches a thought in one tap so it stops taking attention; the list reaches the computer with the phone sync. */
export class IdeaList extends HTMLElement {
  #store = new IdeaStore();
  #ideas = this.#store.load();

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [styles];
    this.shadowRoot.innerHTML = template;
    this.shadowRoot.querySelector('form').addEventListener('submit', (event) => this.#add(event));
    this.shadowRoot.querySelector('ul').addEventListener('click', (event) => this.#remove(event));
  }

  connectedCallback() {
    this.#render();
  }

  #render() {
    this.shadowRoot.querySelector('ul').innerHTML = this.#ideas.map(idea_template).join('');
  }

  #add(event) {
    event.preventDefault();
    const input = this.shadowRoot.querySelector('input');
    const text = input.value.trim();
    if (!text) return;
    this.#update([{ created: local_minute(new Date()), text }, ...this.#ideas]);
    input.value = '';
  }

  #remove(event) {
    const button = event.target.closest('button[data-created]');
    if (!button) return;
    this.#update(this.#ideas.filter((idea) => idea.created !== button.dataset.created));
  }

  #update(ideas) {
    this.#ideas = ideas;
    this.#store.save(ideas);
    this.#render();
  }
}

function idea_template(idea) {
  return /* html */ `<li>
    <time datetime="${escape_html(idea.created)}">${escape_html(format_created(idea.created))}</time>
    <span>${escape_html(idea.text)}</span>
    <button type="button" data-created="${escape_html(idea.created)}" aria-label="Borrar idea">×</button>
  </li>`;
}

/** Local time, not UTC, so the stored minute matches the phone clock. */
function local_minute(date) {
  const pad = (number) => String(number).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function format_created(created) {
  const date = new Date(created);
  return `${date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })} ${created.slice(11)}`;
}

customElements.define('idea-list', IdeaList);
