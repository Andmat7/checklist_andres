// The site lives at the repo root next to node_modules and android, so only the files the page serves are copied into the app.
import { cpSync, rmSync } from 'node:fs';

const web_dir = 'www';
const served_paths = ['index.html', 'cronometro.html', 'manifest.webmanifest', 'no_cache_worker.js', 'src', 'data', 'assets'];

rmSync(web_dir, { recursive: true, force: true });
served_paths.forEach((path) => cpSync(path, `${web_dir}/${path}`, { recursive: true }));
