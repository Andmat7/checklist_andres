const styles = new CSSStyleSheet();

styles.replaceSync(/* css */ `
  :host {
    display: block;
  }
  .hint {
    margin: 0;
    text-align: center;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--muted);
  }
  section {
    padding: 16px;
    border-radius: 16px;
    border: 1px solid color-mix(in srgb, var(--layer-color) 70%, transparent);
    background: color-mix(in srgb, var(--layer-color) 22%, rgb(11 10 26 / 0.6));
    color: #ffffff;
  }
  h2 {
    margin: 0;
    text-align: center;
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  pyramid-view {
    margin-top: 14px;
  }
  ul {
    list-style: none;
    margin: 14px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  label {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.3;
    cursor: pointer;
  }
  input[type="checkbox"] {
    appearance: none;
    flex: none;
    width: 18px;
    height: 18px;
    margin: 1px 0 0;
    border: 2px solid rgb(255 255 255 / 0.9);
    border-radius: 50%;
    cursor: pointer;
  }
  input[type="checkbox"]:checked {
    background: #ffffff;
    box-shadow: inset 0 0 0 3px var(--layer-color);
  }
  input[type="checkbox"]:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
  li.answer label {
    align-items: center;
    justify-content: space-between;
    cursor: default;
  }
  select {
    padding: 4px 8px;
    border: 2px solid rgb(255 255 255 / 0.9);
    border-radius: 10px;
    background: rgb(11 10 26 / 0.6);
    color: #ffffff;
    font: inherit;
    cursor: pointer;
  }
  select:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
  li.numbers {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    font-size: 0.95rem;
    font-weight: 600;
  }
  .fields {
    display: flex;
    gap: 6px;
  }
  input[type="number"] {
    appearance: textfield;
    width: 6.2em;
    padding: 4px 6px;
    border: 2px solid rgb(255 255 255 / 0.9);
    border-radius: 10px;
    background: rgb(11 10 26 / 0.6);
    color: #ffffff;
    font: inherit;
    font-size: 0.85rem;
    text-align: center;
  }
  input[type="number"]::-webkit-inner-spin-button {
    appearance: none;
  }
  input[type="number"]::placeholder {
    color: rgb(255 255 255 / 0.55);
  }
  input[type="number"]:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
  .price {
    margin-left: auto;
    font-size: 0.85rem;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    opacity: 0.8;
  }
  li.done span {
    text-decoration: line-through;
    opacity: 0.6;
  }
`);

export default styles;
