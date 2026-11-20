// Leonida Ledger — the entry program (Node 22, standard library only).
//
// The guide is plain static files in app/ (index.html, its ES modules, CSS
// and data/trophies.json), and its screenshots live in screenshots/. This
// program hands the guide in: it copies app/ and screenshots/ from beside
// this file to /output and writes /output/dossier.json with the vendored
// make.fun library, which is the summary the judge reads — the screenshots,
// the first load's files and bytes, and the source. Leave
// vendor/makefun-frontend.ts exactly as the kit ships it: the scorer
// rebuilds the dossier with its own copy and compares the two byte for byte.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Run it twice: both runs must write the same bytes.

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's own caps: the dossier text is capped at 160 KiB, at most 4
// screenshots of at most 256 KiB each, and app/ holds at most 993 files and
// directories totalling 48 MiB. The dossier is refused while app/ or
// screenshots/ is past those limits, so the caps are passed here too.
const dossierPath = join(outputDir, 'dossier.json');
writeFileSync(
  dossierPath,
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);

// Read the dossier back and confirm it is well-formed before reporting
// success: a truncated or corrupt write should fail here, not at the gate.
const dossier = JSON.parse(readFileSync(dossierPath, 'utf8'));
console.log(
  `Leonida Ledger handed in: dossier.json is ${dossier.text.length} bytes of text ` +
    `with ${dossier.images.length} screenshots.`,
);
