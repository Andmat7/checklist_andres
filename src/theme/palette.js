import { current_period } from '../services/day_period.js';

// Sunset at the top fading into night at the base, so every layer belongs to one gradient. Base first.
const purple_layer_colors_by_depth = [
  ['#4b3a9a', '#a8437a', '#d9594c'],
  ['#2f5a9e', '#3f62c4', '#5a4cc8'],
];
const purple_star_colors = ['#ffffff', '#ffd166', '#c9b8ff'];

const themes = {
  day: {
    layer_colors_by_depth: purple_layer_colors_by_depth,
    star_colors: purple_star_colors,
  },
  night: {
    layer_colors_by_depth: purple_layer_colors_by_depth,
    star_colors: purple_star_colors,
  },
};

// The period is fixed at load, so the theme matches the pyramid shown until the next reload.
const theme = themes[current_period()];

export const layer_colors_by_depth = theme.layer_colors_by_depth;

export const apex_colors = ['#ffd166', '#f7a541'];

export const star_colors = theme.star_colors;

export const sparkle_colors = ['#ffd166', '#ffffff'];

/** Each nesting depth has its own gradient; positions count from the base. */
export function layer_color(depth, base_position) {
  const colors = layer_colors_by_depth[depth % layer_colors_by_depth.length];
  return colors[base_position % colors.length];
}

/** A layer can name its own color in the JSON; otherwise it takes its gradient slot. */
export function color_of_layer(layer, depth, base_position) {
  return layer.color ?? layer_color(depth, base_position);
}

const dark_text = '#1a1333';
const light_text = '#ffffff';

/** Light backgrounds get dark text; the threshold is where white text on the color stops reading well. */
export function text_color_on(hex_background) {
  const [red, green, blue] = [1, 3, 5].map((start) => parseInt(hex_background.slice(start, start + 2), 16) / 255);
  const brightness = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  return brightness > 0.6 ? dark_text : light_text;
}
