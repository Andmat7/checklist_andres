import { apex_colors } from '../../theme/palette.js';

const styles = new CSSStyleSheet();

styles.replaceSync(/* css */ `
  :host {
    display: block;
    margin-top: 32px;
  }
  h2 {
    margin: 0 0 12px;
    text-align: center;
    font-size: 0.85rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
    max-width: 320px;
    margin: 0 auto;
  }
  .weekday {
    text-align: center;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--muted);
  }
  .day {
    aspect-ratio: 1;
    border-radius: 6px;
    /* --done goes from 0% to 100%, so a full day shows the apex color and an empty one stays faint. */
    background: color-mix(in srgb, ${apex_colors[0]} var(--done), rgb(255 255 255 / 0.06));
  }
  .day.today {
    outline: 2px solid #ffffff;
    outline-offset: 1px;
  }
  .day.future {
    visibility: hidden;
  }
  button {
    display: block;
    margin: 20px auto 0;
    padding: 10px 20px;
    border: 1px solid rgb(255 255 255 / 0.25);
    border-radius: 999px;
    background: rgb(11 10 26 / 0.6);
    color: var(--text);
    font: inherit;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
  }
  button:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
`);

export default styles;
