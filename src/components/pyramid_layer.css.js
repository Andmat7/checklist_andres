const styles = new CSSStyleSheet();

styles.replaceSync(/* css */ `
  :host {
    display: block;
    width: var(--layer-width, 100%);
    margin-inline: auto;
    filter: drop-shadow(0 6px 18px color-mix(in srgb, var(--layer-color) 45%, transparent));
  }
  section {
    /* Inset of the top corners; content is padded by it so nothing gets clipped by the slanted sides. */
    --slant: calc((1 - var(--top-ratio, 1)) * 50%);
    clip-path: polygon(var(--slant) 0, calc(100% - var(--slant)) 0, 100% 100%, 0 100%);
    background: linear-gradient(180deg, var(--layer-color), color-mix(in oklab, var(--layer-color), black 32%));
    padding: 12px calc(var(--slant) + 10px) 14px;
    text-align: center;
    color: #ffffff;
  }
  header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }
  h2 {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    text-shadow: 0 1px 2px rgb(0 0 0 / 0.35);
  }
  .progress {
    font-size: 0.72rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    padding: 1px 8px;
    border-radius: 999px;
    background: rgb(0 0 0 / 0.28);
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
    font-size: 0.9rem;
    font-weight: 600;
    line-height: 1.3;
    text-shadow: 0 1px 2px rgb(0 0 0 / 0.35);
    cursor: pointer;
  }
  input[type="checkbox"] {
    appearance: none;
    flex: none;
    width: 17px;
    height: 17px;
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
  li.done span {
    text-decoration: line-through;
    opacity: 0.6;
  }
`);

export default styles;
