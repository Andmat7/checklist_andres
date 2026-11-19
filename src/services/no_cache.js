const worker_url = new URL('../../no_cache_worker.js', import.meta.url);

/** Installs the worker that bypasses the browser cache, so changes appear on a normal reload. */
export async function disable_cache() {
  // The Android app ships its files inside the APK, so there is no stale deploy to bypass.
  if (!('serviceWorker' in navigator) || window.Capacitor?.isNativePlatform()) return;
  await navigator.serviceWorker.register(worker_url);
}
