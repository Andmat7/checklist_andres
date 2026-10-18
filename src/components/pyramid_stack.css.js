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
    background: linear-gradient(180deg, hsl(var(--apex-hue) 90% 72%), hsl(var(--apex-hue) 70% 50%));
  }
`);

export default styles;
