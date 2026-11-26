// Takes the site's screenshots in headless Chromium with Playwright: one per entry of shots.json, saved as JPEG
// under screenshots/ (or OUT_DIR). Serve the site first (`node serve.ts`). Playwright is not a dependency of the
// site: point PLAYWRIGHT at an installed copy, e.g. PLAYWRIGHT=/path/to/node_modules/playwright node shots.mjs
// Any console error or failed request on a page stops the run, so a broken view is never captured.
import { readFileSync, mkdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT ?? 'playwright');
const base = process.env.BASE_URL ?? 'http://127.0.0.1:8080/';
const outDir = process.env.OUT_DIR ?? 'screenshots';
const shots = JSON.parse(readFileSync(process.env.SHOTS ?? 'shots.json', 'utf8'));

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
for (const shot of shots) {
  const page = await browser.newPage({ viewport: shot.viewport, deviceScaleFactor: 1 });
  const problems = [];
  page.on('console', (m) => m.type() === 'error' && problems.push(m.text()));
  page.on('pageerror', (e) => problems.push(e.message));
  page.on('requestfailed', (r) => problems.push(`request failed: ${r.url()}`));
  page.on('request', (r) => !r.url().startsWith(base) && !r.url().startsWith('blob:') && problems.push(`off-site request: ${r.url()}`));
  await page.goto(base + shot.path, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__shotReady === true);
  for (const step of shot.click ?? []) await page.click(step);
  if (problems.length) throw new Error(`${shot.file}: ${problems.join('; ')}`);
  const file = join(outDir, shot.file);
  await page.screenshot({ path: file, type: 'jpeg', quality: shot.quality ?? 82, fullPage: shot.fullPage ?? false });
  console.log(`${file} ${statSync(file).size} bytes`);
  await page.close();
}
await browser.close();
