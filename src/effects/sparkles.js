import { sparkle_colors } from '../theme/palette.js';
import { Graphics } from './pixi.js';
import { create_transparent_app } from './pixi_app.js';
import { between, pick } from './randomness.js';

const gravity = 0.12;
const fade_per_frame = 0.018;

export class Sparkles {
  #app;
  #particles = [];

  async start(host) {
    this.#app = await create_transparent_app(host);
    this.#app.ticker.add((ticker) => this.#animate(ticker.deltaTime));
  }

  /** Throws star-shaped sparks from a viewport point, mixing the layer's color with gold and white. */
  burst(origin, color, count) {
    const colors = [color, ...sparkle_colors];
    for (let index = 0; index < count; index += 1) this.#particles.push(this.#create_particle(origin, pick(colors)));
  }

  #create_particle(origin, color) {
    const graphic = new Graphics().star(0, 0, 5, between(3, 7), between(1.2, 3)).fill(color);
    graphic.position.set(origin.x, origin.y);
    this.#app.stage.addChild(graphic);
    const angle = between(0, Math.PI * 2);
    const speed = between(2, 6);
    // Extra upward push so sparks rise toward the apex before gravity pulls them down.
    return { graphic, velocity_x: Math.cos(angle) * speed, velocity_y: Math.sin(angle) * speed - 3, spin: between(-0.2, 0.2), life: 1 };
  }

  #animate(delta) {
    for (const particle of this.#particles) this.#move(particle, delta);
    for (const particle of this.#particles) if (particle.life <= 0) particle.graphic.destroy();
    this.#particles = this.#particles.filter((particle) => particle.life > 0);
  }

  #move(particle, delta) {
    particle.velocity_y += gravity * delta;
    particle.graphic.x += particle.velocity_x * delta;
    particle.graphic.y += particle.velocity_y * delta;
    particle.graphic.rotation += particle.spin * delta;
    particle.life -= fade_per_frame * delta;
    particle.graphic.alpha = Math.max(particle.life, 0);
    particle.graphic.scale.set(0.5 + Math.max(particle.life, 0) * 0.5);
  }
}
