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
  form {
    display: flex;
    gap: 8px;
    margin: 20px 0;
  }
  input {
    flex: 1;
    min-width: 0;
    min-height: 44px;
    padding: 10px 14px;
    border: 1px solid rgb(255 255 255 / 0.25);
    border-radius: 999px;
    background: rgb(11 10 26 / 0.6);
    color: var(--text);
    font: inherit;
  }
  button {
    min-height: 44px;
    padding: 10px 16px;
    border: 1px solid ${apex_colors[0]};
    border-radius: 999px;
    background: linear-gradient(135deg, ${apex_colors[0]}, ${apex_colors[1]});
    color: #2a1d4a;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  input:focus-visible,
  button:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2px 8px;
    padding: 12px 0;
    border-bottom: 1px solid rgb(255 255 255 / 0.1);
  }
  time {
    color: var(--muted);
    font-size: 0.78rem;
    font-weight: 700;
  }
  span {
    grid-column: 1;
    overflow-wrap: anywhere;
  }
  li button {
    grid-column: 2;
    grid-row: 1 / span 2;
    align-self: center;
    width: 44px;
    padding: 0;
    border-color: rgb(255 255 255 / 0.25);
    background: none;
    color: var(--muted);
    font-size: 1.2rem;
  }
`);

export default styles;
