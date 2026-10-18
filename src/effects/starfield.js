import { star_colors } from '../theme/palette.js';
import { Graphics } from './pixi.js';
import { create_transparent_app } from './pixi_app.js';
import { between, pick } from './randomness.js';

const star_count = 90;

export class Starfield {
  #app;
  #stars = [];

  async start(host, is_animated) {
    this.#app = await create_transparent_app(host);
    for (let index = 0; index < star_count; index += 1) this.#stars.push(this.#create_star());
    if (is_animated) this.#app.ticker.add((ticker) => this.#animate(ticker));
  }

  #create_star() {
    const graphic = new Graphics().circle(0, 0, between(0.6, 2)).fill(pick(star_colors));
    graphic.position.set(between(0, this.#app.screen.width), between(0, this.#app.screen.height));
    this.#app.stage.addChild(graphic);
    return { graphic, phase: between(0, Math.PI * 2), twinkle_speed: between(0.5, 2), drift: between(0.03, 0.15) };
  }

  #animate(ticker) {
    const seconds = ticker.lastTime / 1000;
    for (const star of this.#stars) {
      star.graphic.alpha = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(seconds * star.twinkle_speed + star.phase));
      star.graphic.y -= star.drift * ticker.deltaTime;
      if (star.graphic.y < 0) star.graphic.position.set(between(0, this.#app.screen.width), this.#app.screen.height);
    }
  }
}
