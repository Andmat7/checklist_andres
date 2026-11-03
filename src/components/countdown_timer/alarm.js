// A rising C major arpeggio rung twice: gentler than a beep, still impossible to miss.
const chime_frequencies = [1046.5, 1318.5, 1568, 2093];
const note_spacing_seconds = 0.13;
const note_decay_seconds = 0.9;
const chime_repeats = 2;
const repeat_spacing_seconds = 1.1;
const peak_volume = 0.18;
// Exponential ramps cannot reach zero, so silence is a value just above it.
const silent_volume = 0.0001;
const vibration_pattern = [200, 100, 200, 100, 400];

/** A synthesized chime plus a vibration, so the end is noticed even with the phone face down. */
export class Alarm {
  #context;

  unlock() {
    this.#context ??= new AudioContext();
    return this.#context.resume();
  }

  ring() {
    navigator.vibrate?.(vibration_pattern);
    if (!this.#context) return;
    const start_time = this.#context.currentTime;
    for (let repeat = 0; repeat < chime_repeats; repeat += 1) {
      chime_frequencies.forEach((frequency, index) => {
        this.#note(frequency, start_time + repeat * repeat_spacing_seconds + index * note_spacing_seconds);
      });
    }
  }

  #note(frequency, start_time) {
    const oscillator = this.#context.createOscillator();
    const gain = this.#context.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(silent_volume, start_time);
    gain.gain.exponentialRampToValueAtTime(peak_volume, start_time + 0.01);
    gain.gain.exponentialRampToValueAtTime(silent_volume, start_time + note_decay_seconds);
    oscillator.connect(gain).connect(this.#context.destination);
    oscillator.start(start_time);
    oscillator.stop(start_time + note_decay_seconds);
  }
}
