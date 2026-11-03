import { apex_colors } from '../../theme/palette.js';
import { Alarm } from './alarm.js';
import styles from './countdown_timer.css.js';
import { ScreenAwake } from './screen_awake.js';

const minute_options = [1, 3, 5];
const milliseconds_per_minute = 60_000;
const tick_milliseconds = 200;
const toggle_labels = { ready: 'Iniciar', running: 'Pausar', paused: 'Seguir', finished: 'Otra vez' };
const status_labels = { ready: 'Listo', running: 'En marcha', paused: 'En pausa', finished: '¡Tiempo!' };

const template = /* html */ `
  <h1>Cronómetro</h1>
  <div class="durations" role="group" aria-label="Duración">
    ${minute_options.map((minutes) => `<button type="button" data-minutes="${minutes}">${minutes} min</button>`).join('')}
  </div>
  <div class="dial">
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id="ring_gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${apex_colors[0]}" />
          <stop offset="1" stop-color="${apex_colors[1]}" />
        </linearGradient>
      </defs>
      <circle class="track" cx="50" cy="50" r="44" />
      <circle class="progress" cx="50" cy="50" r="44" pathLength="100" />
    </svg>
    <div class="readout">
      <p class="time" role="timer"></p>
      <p class="status" aria-live="polite"></p>
    </div>
  </div>
  <div class="controls">
    <button type="button" class="reset">Reiniciar</button>
    <button type="button" class="toggle"></button>
  </div>`;

/** Counts down to a deadline instead of counting ticks, so a throttled tab or a dimmed phone still ends on time. */
export class CountdownTimer extends HTMLElement {
  #alarm = new Alarm();
  #screen = new ScreenAwake();
  #total_milliseconds = minute_options[0] * milliseconds_per_minute;
  #remaining_milliseconds = this.#total_milliseconds;
  #deadline = 0;
  #interval_id = 0;
  #is_running = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [styles];
    this.shadowRoot.innerHTML = template;
    this.shadowRoot.querySelector('.durations').addEventListener('click', (event) => this.#select(event));
    this.shadowRoot.querySelector('.toggle').addEventListener('click', () => this.#toggle());
    this.shadowRoot.querySelector('.reset').addEventListener('click', () => this.#reset(this.#total_milliseconds));
    // The browser drops the wake lock whenever the page is hidden, so it is taken again on return.
    document.addEventListener('visibilitychange', () => this.#keep_screen_awake());
  }

  connectedCallback() {
    this.#render();
  }

  #render() {
    const state = this.#state();
    const elapsed = 1 - this.#remaining_milliseconds / this.#total_milliseconds;
    this.dataset.state = state;
    this.shadowRoot.querySelector('.progress').style.strokeDashoffset = String(elapsed * 100);
    this.shadowRoot.querySelector('.time').textContent = format_clock(this.#remaining_milliseconds);
    this.shadowRoot.querySelector('.status').textContent = status_labels[state];
    this.shadowRoot.querySelector('.toggle').textContent = toggle_labels[state];
    this.shadowRoot.querySelector('.reset').disabled = state === 'ready';
    this.shadowRoot.querySelectorAll('.durations button').forEach((button) => {
      button.setAttribute('aria-pressed', Number(button.dataset.minutes) * milliseconds_per_minute === this.#total_milliseconds);
    });
  }

  #state() {
    if (this.#is_running) return 'running';
    if (this.#remaining_milliseconds === 0) return 'finished';
    return this.#remaining_milliseconds < this.#total_milliseconds ? 'paused' : 'ready';
  }

  #select(event) {
    const button = event.target.closest('button[data-minutes]');
    if (!button) return;
    this.#reset(Number(button.dataset.minutes) * milliseconds_per_minute);
  }

  #toggle() {
    if (this.#is_running) this.#pause();
    else this.#start();
  }

  #start() {
    if (this.#remaining_milliseconds === 0) this.#remaining_milliseconds = this.#total_milliseconds;
    // Phones only allow sound started by a tap, so the alarm is unlocked here and rung later.
    this.#alarm.unlock().catch((error) => console.warn('Alarm sound disabled:', error));
    this.#deadline = Date.now() + this.#remaining_milliseconds;
    this.#interval_id = setInterval(() => this.#tick(), tick_milliseconds);
    this.#is_running = true;
    this.#keep_screen_awake();
    this.#render();
  }

  #pause() {
    this.#remaining_milliseconds = Math.max(0, this.#deadline - Date.now());
    this.#stop();
    this.#render();
  }

  #reset(total_milliseconds) {
    this.#stop();
    this.#total_milliseconds = total_milliseconds;
    this.#remaining_milliseconds = total_milliseconds;
    this.#render();
  }

  #tick() {
    this.#remaining_milliseconds = Math.max(0, this.#deadline - Date.now());
    if (this.#remaining_milliseconds === 0) {
      this.#stop();
      this.#alarm.ring();
    }
    this.#render();
  }

  #stop() {
    clearInterval(this.#interval_id);
    this.#is_running = false;
    this.#screen.release().catch((error) => console.warn('Could not release the screen:', error));
  }

  #keep_screen_awake() {
    if (!this.#is_running || document.visibilityState !== 'visible') return;
    this.#screen.hold().catch((error) => console.warn('Screen may dim while counting:', error));
  }
}

/** Seconds round up, so a fresh minute reads 1:00 and 0:00 only shows when time is really up. */
function format_clock(milliseconds) {
  const seconds = Math.ceil(milliseconds / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

customElements.define('countdown-timer', CountdownTimer);
