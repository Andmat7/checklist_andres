import { parse_layer } from '../models/layer.js';

const pyramid_url = new URL('../../data/pyramid.json', import.meta.url);

export async function load_pyramid() {
  const response = await fetch(pyramid_url);
  if (!response.ok) throw new Error(`Could not load ${pyramid_url}: HTTP ${response.status}`);
  const pyramid = await response.json();
  return pyramid.layers.map((layer) => parse_layer(layer));
}
