import { create_checks, is_checked, toggle_check } from './checks.js';
import { all_tasks, filter_layers } from './layer.js';

/**
 * @typedef {import('./checks.js').Checks} Checks
 * @typedef {import('./layer.js').Layer} Layer
 * @typedef {Object} ShoppingList
 * @property {Checks} needed Marked while checking what is missing at home.
 * @property {Checks} bought Marked at the store; always within `needed`.
 */

export function create_shopping_list() {
  return { needed: create_checks(), bought: create_checks() };
}

/** Un-marking an item as missing also drops it from the purchases, so `bought` stays within `needed`. */
export function toggle_needed(list, task_id) {
  const bought = is_checked(list.bought, task_id) ? toggle_check(list.bought, task_id) : list.bought;
  return { needed: toggle_check(list.needed, task_id), bought };
}

export function toggle_bought(list, task_id) {
  return { ...list, bought: toggle_check(list.bought, task_id) };
}

/** The shopping trip only walks through the stores and items marked as missing. */
export function needed_layers(layers, list) {
  return filter_layers(layers, (task) => is_checked(list.needed, task.id));
}

export function marked_tasks(layers, checks) {
  return layers.flatMap(all_tasks).filter((task) => is_checked(checks, task.id));
}
