import styles from './app_shell.css.js';
import '../pyramid_checklist/pyramid_checklist.js';
import '../budget_planner/budget_planner.js';

const default_section = 'diaria';

const template = /* html */ `
  <nav>
    <a href="#diaria" data-section="diaria">Diaria</a>
    <a href="#presupuesto" data-section="presupuesto">Presupuesto</a>
  </nav>
  <pyramid-checklist data-section="diaria"></pyramid-checklist>
  <budget-planner data-section="presupuesto"></budget-planner>`;

/** The section lives in the URL hash, so a reload keeps you where you were. */
export class AppShell extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [styles];
    this.shadowRoot.innerHTML = template;
    window.addEventListener('hashchange', () => this.#show_section());
    this.#show_section();
  }

  #show_section() {
    const requested = location.hash.slice(1);
    const known = [...this.shadowRoot.querySelectorAll('nav a')].some((link) => link.dataset.section === requested);
    const section = known ? requested : default_section;
    this.shadowRoot.querySelectorAll('nav a').forEach((link) => mark_current(link, link.dataset.section === section));
    this.shadowRoot.querySelectorAll(':not(a)[data-section]').forEach((element) => { element.hidden = element.dataset.section !== section; });
  }
}

// An empty aria-current reads as "false", so the attribute is removed instead.
function mark_current(link, is_current) {
  if (is_current) link.setAttribute('aria-current', 'page');
  else link.removeAttribute('aria-current');
}

customElements.define('app-shell', AppShell);
