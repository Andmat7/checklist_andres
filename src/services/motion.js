export function prefers_reduced_motion() {
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
}
