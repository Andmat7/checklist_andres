import styles from './pyramid_stack.css.js';
import './pyramid_layer.js';

/** One hue set per nesting depth (base first), so an inner pyramid stands out from its parent layer. */
const hues_by_depth = [
  [255, 175, 38],
  [220, 150, 12],
];
const lightness_by_depth = ['18%', '26%'];

/** Width of the pyramid tip relative to its base; wide enough that the top layer's tasks still fit on a phone. */
const apex_ratio = 0.55;

export class PyramidStack extends HTMLElement {
  #checks;
  #depth;
  #layer_count;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [styles];
  }

  show(layers, checks, depth = 0) {
    this.#checks = checks;
    this.#depth = depth;
    this.#layer_count = layers.length;
    this.style.setProperty('--apex-width', `${apex_ratio * 100}%`);
    this.style.setProperty('--apex-hue', this.#hue_at(layers.length - 1));
    const top_first = [...layers].reverse();
    this.shadowRoot.replaceChildren(...top_first.map((layer, position) => this.#create_layer(layer, position)));
  }

  #create_layer(layer, position) {
    const element = document.createElement('pyramid-layer');
    const top_width = this.#width_at(position);
    const bottom_width = this.#width_at(position + 1);
    element.style.setProperty('--layer-width', `${bottom_width * 100}%`);
    element.style.setProperty('--top-ratio', top_width / bottom_width);
    element.style.setProperty('--layer-hue', this.#hue_at(this.#layer_count - 1 - position));
    element.style.setProperty('--layer-lightness', lightness_by_depth[this.#depth % lightness_by_depth.length]);
    element.show(layer, this.#checks, this.#depth);
    return element;
  }

  /** Edges grow linearly from the apex, so the stacked trapezoids line up into one triangle. */
  #width_at(edge) {
    return apex_ratio + ((1 - apex_ratio) * edge) / this.#layer_count;
  }

  #hue_at(base_position) {
    const hues = hues_by_depth[this.#depth % hues_by_depth.length];
    return hues[base_position % hues.length];
  }
}

customElements.define('pyramid-stack', PyramidStack);
