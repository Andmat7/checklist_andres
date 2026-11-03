/** Keeps the phone screen on while counting; browsers without Wake Lock simply let it dim. */
export class ScreenAwake {
  #sentinel;

  async hold() {
    if (!('wakeLock' in navigator) || this.#sentinel) return;
    this.#sentinel = await navigator.wakeLock.request('screen');
    this.#sentinel.addEventListener('release', () => { this.#sentinel = undefined; });
  }

  async release() {
    await this.#sentinel?.release();
  }
}
