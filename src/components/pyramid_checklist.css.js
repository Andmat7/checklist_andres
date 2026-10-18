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
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  p {
    margin: 4px 0 24px;
    text-align: center;
    font-size: 0.85rem;
    color: var(--muted);
  }
  p::first-letter {
    text-transform: uppercase;
  }
`);

export default styles;
