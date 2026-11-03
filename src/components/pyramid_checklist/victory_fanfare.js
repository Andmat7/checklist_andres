const fanfare_url = new URL('../../../assets/sounds/victory_fanfare.mp3', import.meta.url);

/** Played straight from the checkbox tap, which is what lets phones start the sound. */
export class VictoryFanfare {
  #audio = new Audio(fanfare_url);

  play() {
    this.#audio.currentTime = 0;
    this.#audio.play().catch((error) => console.warn('Fanfare muted:', error));
  }
}
