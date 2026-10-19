import { parse_layer } from '../models/layer.js';

/** Loads a pyramid from data/, e.g. "pyramid.json". */
export async function load_pyramid(file_name) {
  const pyramid_url = new URL(`../../data/${file_name}`, import.meta.url);
  const response = await fetch(pyramid_url);
  if (!response.ok) throw new Error(`Could not load ${pyramid_url}: HTTP ${response.status}`);
  const pyramid = await response.json();
  return pyramid.layers.map((layer) => parse_layer(layer));
}
