// Isolated headless checks: no desktop input, real credentials or public chat writes.
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from '@playwright/test';
const require = createRequire(import.meta.url);
const kitRequire = createRequire(require.resolve('@sveltejs/kit/package.json'));
const pluginFolder = dirname(kitRequire.resolve('@sveltejs/vite-plugin-svelte/package.json'));
const { svelte, vitePreprocess } = await import(
  pathToFileURL(resolve(pluginFolder, 'src/index.js')).href
);
const folder = dirname(fileURLToPath(import.meta.url));
const environment = {
  name: 'isolated-kit-environment',
  resolveId(id) {
    if (id === '$app/environment') return '\0video-test-environment';
  },
  load(id) {
    if (id === '\0video-test-environment')
      return 'export const browser=true; export const dev=true; export const building=false; export const version="test";';
  }
};
const server = await createServer({
  configFile: false,
  root: folder,
  plugins: [environment, svelte({ configFile: false, preprocess: vitePreprocess() })],
  server: { host: '127.0.0.1', port: 0, fs: { allow: [resolve(folder, '../..')] } }
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch({
    headless: true,
    channel: process.env.VIDEO_TEST_BROWSER || 'msedge'
  });
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('PAGE_ERROR:', e.message));
  await page.setViewportSize({width:408,height:140});
  await page.goto('http://127.0.0.1:' + server.httpServer.address().port + '/toolbar.html');
  await page.locator('.input-sticker').waitFor();
  await page.waitForTimeout(4000);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({path:process.env.TOOLBAR_CAPTURE || '../toolbar-after.png'});
  console.log(JSON.stringify(await page.locator('.input-sticker .sticker-section.right :is(svg,i)').evaluateAll(elements => elements.map(e => {
    const b=e.getBoundingClientRect(),s=getComputedStyle(e); return {icon:e.getAttribute('data-icon') || e.className,y:b.y,height:b.height,center:b.y+b.height/2,font:s.fontSize,family:s.fontFamily,verticalAlign:s.verticalAlign};
  })),null,2));
  for (const width of [320, 408, 620]) {
    await page.setViewportSize({width,height:140});
    const centers = await page.locator('.input-sticker :is(svg,i)').evaluateAll(elements => elements.map(e => e.getBoundingClientRect()).filter(b => b.height > 0).map(b => b.y+b.height/2));
    assert.ok(Math.max(...centers)-Math.min(...centers) < 0.1, 'Toolbar icons must share a vertical center at width '+width);
  }
  await page.setViewportSize({width:408,height:140});
  await page.screenshot({path:'../toolbar-after.png'});
  console.log('PASS: actual ChatInterface, global CSS and site Font Awesome share icon centers at widths 320/408/620.');
} finally { await browser?.close(); await server.close(); }
