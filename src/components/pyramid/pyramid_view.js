import { layer_color } from '../../theme/palette.js';
import styles from './pyramid_view.css.js';
import './pyramid_stack.js';
import '../layer_panel/layer_panel.js';

const template = /* html */ `
  <pyramid-stack></pyramid-stack>
  <layer-panel></layer-panel>`;

/** Tasks open below the pyramid instead of inside it, so the slices stay thin enough to form a real triangle. */
export class PyramidView extends HTMLElement {
  #layers = [];
  #checks;
  #depth = 0;
  #selected_id;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [styles];
    this.shadowRoot.innerHTML = template;
    this.shadowRoot.querySelector('pyramid-stack').addEventListener('layer-select', (event) => this.#select(event.detail.layer_id));
  }

  show(layers, checks, depth = 0) {
    this.#layers = layers;
    this.#checks = checks;
    this.#depth = depth;
    this.#render();
  }

  #select(layer_id) {
    this.#selected_id = layer_id === this.#selected_id ? undefined : layer_id;
    this.#render();
  }

  #render() {
    const selected = this.#layers.find((layer) => layer.id === this.#selected_id);
    const color = selected && layer_color(this.#depth, this.#layers.indexOf(selected));
    const context = { depth: this.#depth, selected_id: selected?.id };
    this.shadowRoot.querySelector('pyramid-stack').show(this.#layers, this.#checks, context);
    this.shadowRoot.querySelector('layer-panel').show(selected, this.#checks, { depth: this.#depth, color });
  }
}

customElements.define('pyramid-view', PyramidView);
