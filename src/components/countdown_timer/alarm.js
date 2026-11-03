const beep_count = 3;
const beep_seconds = 0.18;
const beep_gap_seconds = 0.12;
const beep_frequency = 880;
const beep_volume = 0.3;
// Exponential ramps cannot reach zero, so silence is a value just above it.
const silent_volume = 0.0001;
const vibration_pattern = [200, 100, 200, 100, 400];

/** Three short beeps plus a vibration, so the end is noticed even with the phone face down. */
export class Alarm {
  #context;

  unlock() {
    this.#context ??= new AudioContext();
    return this.#context.resume();
  }

  ring() {
    navigator.vibrate?.(vibration_pattern);
    if (!this.#context) return;
    for (let index = 0; index < beep_count; index += 1) {
      this.#beep(this.#context.currentTime + index * (beep_seconds + beep_gap_seconds));
    }
  }

  #beep(start_time) {
    const oscillator = this.#context.createOscillator();
    const gain = this.#context.createGain();
    oscillator.frequency.value = beep_frequency;
    gain.gain.setValueAtTime(silent_volume, start_time);
    gain.gain.exponentialRampToValueAtTime(beep_volume, start_time + 0.02);
    gain.gain.exponentialRampToValueAtTime(silent_volume, start_time + beep_seconds);
    oscillator.connect(gain).connect(this.#context.destination);
    oscillator.start(start_time);
    oscillator.stop(start_time + beep_seconds);
  }
}
