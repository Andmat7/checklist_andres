const styles = new CSSStyleSheet();

styles.replaceSync(/* css */ `
  :host {
    display: block;
    width: var(--layer-width, 100%);
    margin-inline: auto;
  }
  section {
    background: hsl(var(--layer-hue) 70% var(--layer-lightness, 92%));
    border-radius: 14px;
    padding: 14px 16px;
    border: 1px solid rgb(128 128 128 / 0.25);
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  h2 {
    margin: 0;
    font-size: 1.15rem;
  }
  pyramid-stack {
    margin-top: 12px;
  }
  .progress {
    font-variant-numeric: tabular-nums;
    opacity: 0.75;
  }
  ul {
    list-style: none;
    margin: 10px 0;
    padding: 0;
  }
  li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
  }
  label {
    flex: 1;
    display: flex;
    gap: 8px;
    align-items: center;
    cursor: pointer;
  }
  li.done span {
    text-decoration: line-through;
    opacity: 0.6;
  }
  button {
    border: 0;
    border-radius: 8px;
    background: rgb(128 128 128 / 0.2);
    color: inherit;
    cursor: pointer;
    font: inherit;
    padding: 4px 10px;
  }
  form {
    display: flex;
    gap: 8px;
  }
  input[type="text"] {
    flex: 1;
    min-width: 0;
    border: 1px solid rgb(128 128 128 / 0.35);
    border-radius: 8px;
    padding: 6px 10px;
    font: inherit;
    background: transparent;
    color: inherit;
  }
`);

export default styles;
