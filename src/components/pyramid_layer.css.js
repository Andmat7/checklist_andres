const styles = new CSSStyleSheet();

styles.replaceSync(/* css */ `
  :host {
    --accent: hsl(var(--layer-hue) 85% 72%);
    display: block;
    width: var(--layer-width, 100%);
    margin-inline: auto;
  }
  section {
    /* Inset of the top corners; content is padded by it so nothing gets clipped by the slanted sides. */
    --slant: calc((1 - var(--top-ratio, 1)) * 50%);
    clip-path: polygon(var(--slant) 0, calc(100% - var(--slant)) 0, 100% 100%, 0 100%);
    background: linear-gradient(
      180deg,
      hsl(var(--layer-hue) 45% calc(var(--layer-lightness) + 6%)),
      hsl(var(--layer-hue) 40% var(--layer-lightness))
    );
    padding: 12px calc(var(--slant) + 10px) 14px;
    text-align: center;
  }
  header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }
  h2 {
    margin: 0;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent);
  }
  .progress {
    font-size: 0.72rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    padding: 1px 8px;
    border-radius: 999px;
    color: hsl(var(--layer-hue) 40% 12%);
    background: var(--accent);
  }
  pyramid-stack {
    margin-top: 8px;
  }
  ul {
    list-style: none;
    margin: 8px 0 0;
    padding: 0;
    display: inline-flex;
    flex-direction: column;
    gap: 6px;
    text-align: left;
  }
  label {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    font-size: 0.88rem;
    line-height: 1.3;
    cursor: pointer;
  }
  input[type="checkbox"] {
    appearance: none;
    flex: none;
    width: 17px;
    height: 17px;
    margin: 1px 0 0;
    border: 2px solid var(--accent);
    border-radius: 50%;
    cursor: pointer;
  }
  input[type="checkbox"]:checked {
    background: var(--accent);
    box-shadow: inset 0 0 0 3px hsl(var(--layer-hue) 40% var(--layer-lightness));
  }
  input[type="checkbox"]:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  li.done span {
    text-decoration: line-through;
    opacity: 0.5;
  }
`);

export default styles;
