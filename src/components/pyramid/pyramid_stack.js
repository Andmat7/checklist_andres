import { all_tasks, count_checked } from '../../models/layer.js';
import { escape_html } from '../../services/escape_html.js';
import { layer_color } from '../../theme/palette.js';
import styles from './pyramid_stack.css.js';

const row_height = 64;
const row_gap = 4;

const capstone_template = /* html */ `<div class="row capstone" aria-hidden="true"></div>`;

const layer_template = (layer, checks, selected_id) => /* html */ `
  <button type="button" class="row ${count_checked(layer, checks) === all_tasks(layer).length ? 'complete' : ''}"
    data-layer-id="${escape_html(layer.id)}" aria-pressed="${layer.id === selected_id}">
    <span class="title">${escape_html(layer.title)}</span>
    <span class="progress">${count_checked(layer, checks)}/${all_tasks(layer).length}</span>
  </button>`;

/** Draws the layers as slices of one triangle; picking a slice emits `layer-select`. */
export class PyramidStack extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [styles];
    this.style.setProperty('--row-height', `${row_height}px`);
    this.style.setProperty('--row-gap', `${row_gap}px`);
    this.shadowRoot.addEventListener('click', (event) => this.#on_click(event));
  }

  show(layers, checks, { depth, selected_id }) {
    const top_first = [...layers].reverse();
    this.toggleAttribute('has-selection', selected_id !== undefined);
    this.shadowRoot.innerHTML = capstone_template
      + top_first.map((layer) => layer_template(layer, checks, selected_id)).join('');
    const rows = [...this.shadowRoot.querySelectorAll('.row')];
    rows.forEach((row, index) => shape_row(row, index, rows.length));
    rows.slice(1).forEach((row, index) => row.style.setProperty('--layer-color', layer_color(depth, layers.length - 1 - index)));
  }

  #on_click(event) {
    const button = event.target.closest('button[data-layer-id]');
    if (!button) return;
    const layer_id = button.dataset.layerId;
    this.dispatchEvent(new CustomEvent('layer-select', { detail: { layer_id } }));
    // Selecting re-renders the stack, so keep keyboard focus on the same layer.
    this.shadowRoot.querySelector(`[data-layer-id="${CSS.escape(layer_id)}"]`)?.focus();
  }
}

/** Every slice's sides follow the same two lines from the tip to the base, gaps included, so the edges stay straight. */
function shape_row(row, index, row_count) {
  const total_height = row_count * row_height + (row_count - 1) * row_gap;
  const top = index * (row_height + row_gap);
  const inset_at = (height) => `${(1 - height / total_height) * 50}%`;
  row.style.setProperty('--top-inset', inset_at(top));
  row.style.setProperty('--bottom-inset', inset_at(top + row_height));
}

customElements.define('pyramid-stack', PyramidStack);
