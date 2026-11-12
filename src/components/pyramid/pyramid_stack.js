import { all_tasks, count_checked } from '../../models/layer.js';
import { escape_html } from '../../services/escape_html.js';
import { color_of_layer, text_color_on } from '../../theme/palette.js';
import styles from './pyramid_stack.css.js';

const row_height = 64;
const row_gap = 4;
const thin_row_threshold = 1;

const capstone_template = /* html */ `<div class="row capstone" aria-hidden="true"></div>`;

const layer_template = (layer, checks, selected_id) => /* html */ `
  <button type="button" class="row ${count_checked(layer, checks) === all_tasks(layer).length ? 'complete' : ''}
    ${height_ratio_of(layer) < thin_row_threshold ? 'thin' : ''}"
    data-layer-id="${escape_html(layer.id)}" aria-pressed="${layer.id === selected_id}">
    <span class="title">${escape_html(layer.title)}</span>
    <span class="progress">${count_checked(layer, checks)}/${all_tasks(layer).length}</span>
  </button>`;

/** Draws the layers as slices of one triangle; picking a slice emits `layer-select`. */
export class PyramidStack extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [styles];
    this.style.setProperty('--row-gap', `${row_gap}px`);
    this.shadowRoot.addEventListener('click', (event) => this.#on_click(event));
  }

  show(layers, checks, { depth, selected_id }) {
    const top_first = [...layers].reverse();
    this.toggleAttribute('has-selection', selected_id !== undefined);
    this.shadowRoot.innerHTML = capstone_template
      + top_first.map((layer) => layer_template(layer, checks, selected_id)).join('');
    const rows = [...this.shadowRoot.querySelectorAll('.row')];
    const heights = rows.map((row, index) => (index === 0 ? row_height : row_height * height_ratio_of(top_first[index - 1])));
    shape_rows(rows, heights);
    rows.slice(1).forEach((row, index) => {
      const layer = top_first[index];
      const color = color_of_layer(layer, depth, layers.length - 1 - index);
      row.style.setProperty('--layer-color', color);
      row.style.setProperty('--layer-text', text_color_on(color));
    });
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

function height_ratio_of(layer) {
  return layer.height_ratio ?? 1;
}

/** Every slice's sides follow the same two lines from the tip to the base, gaps included, so the edges stay straight. */
function shape_rows(rows, heights) {
  const total_height = heights.reduce((sum, height) => sum + height, 0) + row_gap * (rows.length - 1);
  const inset_at = (offset) => `${(1 - offset / total_height) * 50}%`;
  let top = 0;
  rows.forEach((row, index) => {
    row.style.setProperty('--row-height', `${heights[index]}px`);
    row.style.setProperty('--top-inset', inset_at(top));
    row.style.setProperty('--bottom-inset', inset_at(top + heights[index]));
    top += heights[index] + row_gap;
  });
}

customElements.define('pyramid-stack', PyramidStack);
