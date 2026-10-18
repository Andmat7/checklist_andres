const styles = new CSSStyleSheet();

styles.replaceSync(/* css */ `
  :host {
    display: block;
    max-width: 720px;
    margin: 0 auto;
    padding: 24px 16px;
  }
  h1 {
    text-align: center;
    margin: 0 0 4px;
  }
  p {
    text-align: center;
    margin: 0 0 20px;
    opacity: 0.7;
  }
`);

export default styles;
