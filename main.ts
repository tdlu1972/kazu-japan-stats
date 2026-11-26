// Kazu, Japan in figures: hands the site in for make.fun's national statistics site bounty (Node 22, standard
// library only). The site is app/, static files with no build step; this copies app/ and screenshots/ to /output
// (MAKEFUN_OUTPUT_DIR outside the grader) and writes dossier.json with the kit's unchanged vendor library.

import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const root = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(root, 'app'), join(out, 'app'), { recursive: true });
cpSync(join(root, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's caps: the dossier text is cut at 160 KiB; at most 4 screenshots of 256 KiB; app/ within 993 entries
// and 16 MiB.
const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(out, 'dossier.json'), dossier);
