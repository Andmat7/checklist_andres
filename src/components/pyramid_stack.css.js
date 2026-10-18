const styles = new CSSStyleSheet();

styles.replaceSync(/* css */ `
  :host {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`);

export default styles;
