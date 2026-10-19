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
    margin: 4px 0 0;
    text-align: center;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--muted);
  }
  .modes {
    display: flex;
    gap: 8px;
    margin: 20px 0 8px;
  }
  button {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid rgb(255 255 255 / 0.25);
    border-radius: 999px;
    background: rgb(11 10 26 / 0.6);
    color: var(--text);
    font: inherit;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
  }
  button[aria-pressed="true"] {
    border-color: ${apex_colors[0]};
    background: ${apex_colors[0]};
    color: #2a1d4a;
  }
  button:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
  .summary {
    margin-bottom: 20px;
    color: var(--text);
    font-variant-numeric: tabular-nums;
  }
  .empty {
    margin: 24px 0;
  }
  .restart {
    display: block;
    width: 100%;
    margin-top: 24px;
  }
`);

export default styles;
