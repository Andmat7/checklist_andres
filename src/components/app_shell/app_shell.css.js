import { apex_colors } from '../../theme/palette.js';

const styles = new CSSStyleSheet();

// Outer rules beat a component's own :host display, so hiding a section works from here.
styles.replaceSync(/* css */ `
  :host {
    display: block;
  }
  [hidden] {
    display: none;
  }
  nav {
    display: flex;
    justify-content: center;
    gap: 8px;
    max-width: 560px;
    margin: 0 auto;
    padding: 16px 16px 0;
  }
  a {
    padding: 8px 16px;
    border-radius: 999px;
    color: var(--muted);
    font-size: 0.85rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
  }
  a[aria-current] {
    background: rgb(255 255 255 / 0.1);
    color: ${apex_colors[0]};
  }
  a:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
`);

export default styles;
