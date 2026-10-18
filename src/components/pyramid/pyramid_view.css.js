const styles = new CSSStyleSheet();

styles.replaceSync(/* css */ `
  :host {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`);

export default styles;
