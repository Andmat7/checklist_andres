import { apex_colors } from '../../theme/palette.js';

const styles = new CSSStyleSheet();

styles.replaceSync(/* css */ `
  :host {
    display: flex;
    flex-direction: column;
    gap: var(--row-gap);
    filter: drop-shadow(0 10px 28px rgb(168 67 122 / 0.35));
  }
  .row {
    box-sizing: border-box;
    width: 100%;
    height: var(--row-height);
    clip-path: polygon(
      var(--top-inset) 0, calc(100% - var(--top-inset)) 0,
      calc(100% - var(--bottom-inset)) 100%, var(--bottom-inset) 100%
    );
  }
  .capstone {
    background: linear-gradient(180deg, ${apex_colors[0]}, ${apex_colors[1]});
  }
  button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin: 0;
    padding: 0;
    border: 0;
    background: linear-gradient(180deg, var(--layer-color), color-mix(in oklab, var(--layer-color), black 32%));
    color: #ffffff;
    font: inherit;
    cursor: pointer;
    transition: filter 0.2s, opacity 0.2s;
  }
  button:hover,
  button:focus-visible {
    filter: brightness(1.2);
  }
  button:focus-visible {
    outline: none;
  }
  button:focus-visible .title {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  :host([has-selection]) button[aria-pressed="false"] {
    opacity: 0.5;
  }
  .title {
    font-size: 0.74rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    text-shadow: 0 1px 2px rgb(0 0 0 / 0.35);
  }
  .progress {
    font-size: 0.7rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    padding: 1px 8px;
    border-radius: 999px;
    background: rgb(0 0 0 / 0.28);
  }
  .complete .progress {
    background: ${apex_colors[0]};
    color: #2a1d4a;
  }
`);

export default styles;
