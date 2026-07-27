/**
 * Markdown for Agents — genera una versión .md de cada página construida.
 *
 * Se ejecuta DESPUÉS de `astro build`. Por cada `dist/**\/index.html` escribe un
 * `index.md` hermano con el contenido de <main> convertido a Markdown.
 *
 * Vercel sirve estos archivos cuando la petición trae `Accept: text/markdown`
 * (ver los `rewrites` en vercel.json). El HTML sigue siendo el default.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');
const SITE = 'https://adala.mx';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// Los iconos inline y los elementos decorativos no aportan nada a un agente.
turndown.remove(['script', 'style', 'noscript', 'svg']);

/** Recorre dist/ y devuelve todos los index.html. */
const findPages = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return findPages(full);
    return entry.name === 'index.html' ? [full] : [];
  });

/** Ruta pública de un archivo de dist: dist/es/contacto/index.html -> /es/contacto */
const toRoute = (file) => {
  const rel = path.relative(DIST, file).split(path.sep).slice(0, -1).join('/');
  return rel ? `/${rel}` : '/';
};

let written = 0;

for (const file of findPages(DIST)) {
  const route = toRoute(file);
  const $ = cheerio.load(fs.readFileSync(file, 'utf8'));

  $('script, style, noscript, svg, [aria-hidden="true"]').remove();

  const title = $('title').text().trim();
  const description = $('meta[name="description"]').attr('content')?.trim() ?? '';
  const main = $('main');

  let body;

  if (main.length && main.html()?.trim()) {
    body = turndown.turndown(main.html());
  } else if (route === '/') {
    // El index raíz es solo un redirect a /es; damos a los agentes un índice útil.
    body = ['ADALA está disponible en dos idiomas:', '', `- Español: ${SITE}/es`, `- English: ${SITE}/en`].join('\n');
  } else {
    continue;
  }

  const header = [
    `# ${title || 'ADALA'}`,
    '',
    description && `> ${description}`,
    '',
    `Fuente: ${SITE}${route}`,
    '',
    '---',
    '',
  ]
    .filter((line) => line !== false)
    .join('\n');

  // Parte del contenido (p. ej. el formulario de contacto) se renderiza en el
  // cliente, así que apuntamos a las skills donde sí está descrito en texto.
  const footer = [
    '',
    '---',
    '',
    '## Más información para agentes',
    '',
    `- Servicios y trámites: ${SITE}/.well-known/agent-skills/adala-services/SKILL.md`,
    `- Proceso paso a paso: ${SITE}/.well-known/agent-skills/adala-process/SKILL.md`,
    `- Cómo contactar: ${SITE}/.well-known/agent-skills/adala-contact/SKILL.md`,
    `- Índice de skills: ${SITE}/.well-known/agent-skills/index.json`,
  ].join('\n');

  fs.writeFileSync(file.replace(/index\.html$/, 'index.md'), `${header}\n${body}\n${footer}\n`, 'utf8');
  written += 1;
}

console.log(`[markdown-for-agents] ${written} página(s) convertidas a Markdown.`);
