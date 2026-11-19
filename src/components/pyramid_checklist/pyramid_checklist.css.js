import { apex_colors, layer_colors_by_depth } from '../../theme/palette.js';

const styles = new CSSStyleSheet();

styles.replaceSync(/* css */ `
  :host {
    display: block;
    max-width: 560px;
    margin: 0 auto;
    padding: 28px 16px 40px;
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
    margin: 4px 0 24px;
    text-align: center;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--muted);
  }
  p::first-letter {
    text-transform: uppercase;
  }
  .period_switch {
    display: block;
    width: fit-content;
    margin: 0 auto 24px;
    padding: 8px 16px;
    border-radius: 999px;
    background: rgb(255 255 255 / 0.1);
    color: var(--muted);
    font-size: 0.85rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-decoration: none;
  }
  .period_switch:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
`);

export default styles;
