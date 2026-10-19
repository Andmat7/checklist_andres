import { prefers_reduced_motion } from './services/motion.js';
import { disable_cache } from './services/no_cache.js';
import './components/pyramid_checklist/pyramid_checklist.js';

const task_burst = 18;
const layer_complete_burst = 60;
// With reduced motion the stars hold still and bursts stay small, but the reward for checking a task remains.
const reduced_motion_burst_scale = 0.4;

// Effects load PixiJS from a CDN; if it is unreachable the checklist must still work, so failures only warn.
start_effects().catch((error) => console.warn('Effects disabled:', error));
// Opened from file:// or an old browser there is no worker; the app still works, only with normal caching.
disable_cache().catch((error) => console.warn('Cache bypass disabled:', error));

async function start_effects() {
  const is_reduced = prefers_reduced_motion();
  const [{ Starfield }, { Sparkles }] = await Promise.all([
    import('./effects/starfield.js'),
    import('./effects/sparkles.js'),
  ]);
  await new Starfield().start(document.querySelector('#sky'), !is_reduced);
  const sparkles = new Sparkles();
  await sparkles.start(document.querySelector('#sparkles'));
  const burst_scale = is_reduced ? reduced_motion_burst_scale : 1;
  document.addEventListener('task-toggle', (event) => celebrate(sparkles, event.detail, burst_scale));
}

function celebrate(sparkles, detail, burst_scale) {
  if (!detail.checked) return;
  const count = detail.layer_complete ? layer_complete_burst : task_burst;
  sparkles.burst(detail.origin, detail.color, Math.round(count * burst_scale));
}
