import { apex_colors, layer_colors_by_depth } from '../../theme/palette.js';

const styles = new CSSStyleSheet();

styles.replaceSync(/* css */ `
  :host {
    display: block;
    max-width: 560px;
    margin: 0 auto;
    padding: 28px 16px 40px;
  }
  [hidden] {
    display: none;
  }
  h1 {
    margin: 0;
    text-align: center;
    font-size: 1.7rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    background: linear-gradient(90deg, ${apex_colors[0]}, ${layer_colors_by_depth[0][2]});
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  p {
    margin: 0;
  }
  button {
    min-height: 44px;
    padding: 10px 12px;
    border: 1px solid rgb(255 255 255 / 0.25);
    border-radius: 999px;
    background: rgb(11 10 26 / 0.6);
    color: var(--text);
    font: inherit;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  button[aria-pressed="true"] {
    border-color: ${apex_colors[0]};
    background: ${apex_colors[0]};
    color: #2a1d4a;
  }
  button:disabled {
    opacity: 0.4;
    cursor: default;
  }
  button:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
  .durations {
    display: flex;
    gap: 8px;
    margin: 20px 0 0;
  }
  .durations button {
    flex: 1;
  }
  .dial {
    position: relative;
    width: min(78vw, 320px);
    aspect-ratio: 1;
    margin: 28px auto;
  }
  svg {
    position: absolute;
    inset: 0;
    transform: rotate(-90deg);
    overflow: visible;
  }
  circle {
    fill: none;
    stroke-width: 6;
  }
  .track {
    stroke: rgb(255 255 255 / 0.1);
  }
  .progress {
    stroke: url(#ring_gradient) ${apex_colors[0]};
    stroke-linecap: round;
    stroke-dasharray: 100;
    filter: drop-shadow(0 0 6px rgb(255 209 102 / 0.45));
    transition: stroke-dashoffset 0.2s linear;
  }
  .readout {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    gap: 4px;
    text-align: center;
  }
  .time {
    font-size: clamp(3rem, 17vw, 4.5rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .status {
    color: var(--muted);
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .controls {
    display: flex;
    gap: 12px;
  }
  .controls button {
    flex: 1;
    min-height: 54px;
    font-size: 1.05rem;
  }
  .toggle {
    flex: 1.6;
    border-color: ${apex_colors[0]};
    background: linear-gradient(135deg, ${apex_colors[0]}, ${apex_colors[1]});
    color: #2a1d4a;
  }
  .standalone_link {
    display: block;
    margin-top: 20px;
    padding: 12px;
    text-align: center;
    color: var(--muted);
    font-size: 0.85rem;
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .standalone_link:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
  /* Already on the standalone page, so the link would only point back at itself. */
  :host([standalone]) .standalone_link {
    display: none;
  }
  :host([data-state="paused"]) .time {
    opacity: 0.6;
  }
  :host([data-state="finished"]) .progress {
    opacity: 0;
  }
  :host([data-state="finished"]) .track {
    stroke: ${apex_colors[0]};
    animation: pulse 1s ease-in-out infinite;
  }
  :host([data-state="finished"]) .status {
    color: ${apex_colors[0]};
  }
  @keyframes pulse {
    50% {
      opacity: 0.3;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .progress {
      transition: none;
    }
    :host([data-state="finished"]) .track {
      animation: none;
    }
  }
`);

export default styles;
