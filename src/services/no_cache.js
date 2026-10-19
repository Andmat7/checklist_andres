const worker_url = new URL('../../no_cache_worker.js', import.meta.url);

/** Installs the worker that bypasses the browser cache, so changes appear on a normal reload. */
export async function disable_cache() {
  if (!('serviceWorker' in navigator)) return;
  await navigator.serviceWorker.register(worker_url);
}
