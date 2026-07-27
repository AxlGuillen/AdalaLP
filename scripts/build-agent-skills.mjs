/**
 * Genera /.well-known/agent-skills/index.json a partir de los SKILL.md reales.
 *
 * Los digests sha256 se calculan desde el archivo en disco, así el índice nunca
 * queda desincronizado con el contenido publicado.
 *
 * Sigue el Agent Skills Discovery RFC v0.2.0.
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(ROOT, 'public', '.well-known', 'agent-skills');
const SITE = 'https://adala.mx';

/** Lee la `description` del frontmatter de un SKILL.md. */
const readDescription = (contents) => {
  const match = contents.match(/^description:\s*(.+)$/m);
  return match ? match[1].trim() : '';
};

const skills = fs
  .readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const file = path.join(SKILLS_DIR, entry.name, 'SKILL.md');
    if (!fs.existsSync(file)) return null;

    const contents = fs.readFileSync(file);

    return {
      name: entry.name,
      type: 'text/markdown',
      description: readDescription(contents.toString('utf8')),
      url: `${SITE}/.well-known/agent-skills/${entry.name}/SKILL.md`,
      sha256: createHash('sha256').update(contents).digest('hex'),
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.name.localeCompare(b.name));

if (skills.length === 0) {
  console.error('[agent-skills] No se encontró ningún SKILL.md — abortando.');
  process.exit(1);
}

const index = {
  $schema: 'https://agentskills.io/schemas/v0.2.0/index.json',
  version: '0.2.0',
  skills,
};

fs.writeFileSync(path.join(SKILLS_DIR, 'index.json'), `${JSON.stringify(index, null, 2)}\n`, 'utf8');

console.log(`[agent-skills] index.json generado con ${skills.length} skill(s).`);
