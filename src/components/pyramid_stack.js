import styles from './pyramid_stack.css.js';
import './pyramid_layer.js';

/** One hue set per nesting depth, so an inner pyramid stands out from its parent layer. */
const hues_by_depth = [
  [210, 150, 35],
  [265, 330, 185],
];

export class PyramidStack extends HTMLElement {
  #day;
  #depth;
  #layer_count;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [styles];
  }

  show(layers, day, depth = 0) {
    this.#day = day;
    this.#depth = depth;
    this.#layer_count = layers.length;
    const top_first = [...layers].reverse();
    this.shadowRoot.replaceChildren(...top_first.map((layer, position) => this.#create_layer(layer, position)));
  }

  #create_layer(layer, position) {
    const element = document.createElement('pyramid-layer');
    const hues = hues_by_depth[this.#depth % hues_by_depth.length];
    // Narrower toward the top so the stack reads as a pyramid.
    element.style.setProperty('--layer-width', `${60 + (40 * (position + 1)) / this.#layer_count}%`);
    element.style.setProperty('--layer-hue', hues[(this.#layer_count - 1 - position) % hues.length]);
    element.show(layer, this.#day, this.#depth);
    return element;
  }
}

customElements.define('pyramid-stack', PyramidStack);
