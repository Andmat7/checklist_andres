import { Application } from './pixi.js';

/** Full-window, see-through canvas so the page behind or in front stays visible. */
export async function create_transparent_app(host) {
  const app = new Application();
  await app.init({
    resizeTo: window,
    backgroundAlpha: 0,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio,
  });
  host.appendChild(app.canvas);
  return app;
}
