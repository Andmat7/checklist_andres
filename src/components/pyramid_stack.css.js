import { apex_colors } from '../theme/palette.js';

const styles = new CSSStyleSheet();

styles.replaceSync(/* css */ `
  :host {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  :host::before {
    content: "";
    align-self: center;
    width: var(--apex-width);
    height: 30px;
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
    background: linear-gradient(180deg, ${apex_colors[0]}, ${apex_colors[1]});
    filter: drop-shadow(0 0 12px ${apex_colors[0]});
  }
`);

export default styles;
