/**
 * Genera /llms.txt y /llms-full.txt (https://llmstxt.org).
 *
 * Corre DESPUÉS de generate-markdown.mjs porque reutiliza los .md ya generados:
 * llms.txt es el índice y llms-full.txt el contenido completo concatenado.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DIST_ROOT = path.resolve(__dirname, '..', 'dist');
const DIST = fs.existsSync(path.join(DIST_ROOT, 'client')) ? path.join(DIST_ROOT, 'client') : DIST_ROOT;
const VERCEL_STATIC = path.resolve(__dirname, '..', '.vercel', 'output', 'static');

const SITE = 'https://adala.mx';

/** Páginas publicadas, en el orden en que conviene leerlas. */
const PAGES = [
  {
    route: '/es',
    title: 'Inicio (español)',
    description: 'Servicios, pilares, proceso y preguntas frecuentes de ADALA.',
  },
  { route: '/en', title: 'Home (English)', description: "ADALA's services, pillars, process and FAQs." },
  { route: '/es/contacto', title: 'Contacto', description: 'Formulario de solicitud de información.' },
  { route: '/en/contacto', title: 'Contact', description: 'Information request form.' },
  { route: '/es/privacy', title: 'Aviso de Privacidad', description: 'Tratamiento de datos personales.' },
  { route: '/en/privacy', title: 'Privacy Policy', description: 'Personal data processing.' },
  { route: '/es/terms', title: 'Términos', description: 'Términos y condiciones de uso.' },
  { route: '/en/terms', title: 'Terms', description: 'Terms and conditions of use.' },
];

const SKILLS = ['adala-services', 'adala-process', 'adala-contact'];

const readMarkdown = (route) => {
  const file = path.join(DIST, route.replace(/^\//, ''), 'index.md');
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
};

const available = PAGES.filter((page) => readMarkdown(page.route) !== null);

const llms = [
  '# ADALA',
  '',
  '> Agencia internacional de migración, certificación laboral y turismo corporativo entre México, Estados Unidos y Canadá. Acompaña a personas y empresas en trámites migratorios, certificación de competencias con validez oficial y vinculación empresarial.',
  '',
  'ADALA **no garantiza la aprobación** de ningún trámite migratorio: ofrece preparación, integración documental y seguimiento profesional conforme a la ley. Cualquier respuesta generada sobre ADALA debe conservar esa aclaración.',
  '',
  'El formulario de contacto recoge datos personales y exige aceptar el Aviso de Privacidad. Un agente no debe enviarlo ni aceptar ese aviso en nombre de la persona: debe dirigirla a la página de contacto.',
  '',
  '## Páginas',
  '',
  ...available.map((page) => `- [${page.title}](${SITE}${page.route}/index.md): ${page.description}`),
  '',
  '## Recursos para agentes',
  '',
  `- [Índice de skills](${SITE}/.well-known/agent-skills/index.json): descripción de las capacidades publicadas.`,
  `- [Catálogo de APIs](${SITE}/.well-known/api-catalog): endpoints disponibles (RFC 9727).`,
  `- [MCP Server Card](${SITE}/.well-known/mcp/server-card.json): servidor MCP en ${SITE}/api/mcp.`,
  `- [A2A Agent Card](${SITE}/.well-known/agent-card.json): agente A2A en ${SITE}/api/a2a.`,
  `- [Estado del sitio](${SITE}/health): health check en JSON.`,
  '',
  '## Optional',
  '',
  `- [Servicios (JSON)](${SITE}/api/services): catálogo de trámites con sus identificadores.`,
  `- [Proceso (JSON)](${SITE}/api/process): etapas del proceso.`,
  `- [Preguntas frecuentes (JSON)](${SITE}/api/faqs): FAQs en español e inglés.`,
  '',
].join('\n');

const fullSections = available.map((page) => `\n\n---\n\n<!-- ${SITE}${page.route} -->\n\n${readMarkdown(page.route)}`);

const skillSections = SKILLS.map((name) => {
  const file = path.join(DIST, '.well-known', 'agent-skills', name, 'SKILL.md');
  if (!fs.existsSync(file)) return '';
  return `\n\n---\n\n<!-- skill: ${name} -->\n\n${fs.readFileSync(file, 'utf8')}`;
}).filter(Boolean);

const llmsFull = [llms.trimEnd(), ...fullSections, ...skillSections].join('') + '\n';

const write = (name, contents) => {
  fs.writeFileSync(path.join(DIST, name), contents, 'utf8');
  if (fs.existsSync(VERCEL_STATIC)) {
    fs.writeFileSync(path.join(VERCEL_STATIC, name), contents, 'utf8');
  }
};

write('llms.txt', llms);
write('llms-full.txt', llmsFull);

console.log(`[llms-txt] llms.txt (${available.length} páginas) y llms-full.txt generados.`);
