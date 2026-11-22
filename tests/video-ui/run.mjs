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
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  let uploads = 0,
    cancels = 0,
    media = 0;
  await page.route('https://mycast.xyz:9011/video/**', async (route) => {
    const req = route.request();
    const url = req.url();
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    };
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers });
    let json = {};
    if (url.endsWith('/policy')) json = { maxBytes: 50 * 1024 * 1024 };
    else if (req.method() === 'POST') {
      assert.equal(req.headers().authorization, 'Bearer test-session');
      json = { token: 'a'.repeat(64) };
    } else if (req.method() === 'PUT') {
      uploads++;
      json = { id: '12345678-1234-1234-1234-123456789abc' };
    } else if (req.method() === 'DELETE') cancels++;
    else if (url.endsWith('/info')) json = { name: '샘플.mp4', duration: 1, bytes: 1024 };
    else if (url.endsWith('/file.mp4')) {
      media++;
      return route.abort();
    } else return route.fulfill({ status: 404, headers });
    return route.fulfill({
      status: req.method() === 'POST' || req.method() === 'PUT' ? 201 : 200,
      headers,
      contentType: 'application/json',
      body: JSON.stringify(json)
    });
  });
  await page.goto('http://127.0.0.1:' + server.httpServer.address().port);
  await page.getByRole('button', { name: '동영상 첨부', exact: true }).waitFor();
  assert.equal(media, 0, 'Card must not request video before a click');
  await page
    .locator('input[type=file]')
    .setInputFiles({ name: 'clip.mp4', mimeType: 'video/mp4', buffer: Buffer.from('sample') });
  await page.getByRole('button', { name: '업로드', exact: true }).click();
  await page.getByText('업로드 완료. 보내기를 눌러 채팅에 올리세요.').waitFor();
  assert.equal(await page.locator('#sent').textContent(), '', 'Uploading must not post to chat');
  await page.getByRole('button', { name: '보내기', exact: true }).click();
  assert.match(await page.locator('#sent').textContent(), /\/video\/.+\/watch$/);
  assert.equal(uploads, 1);
  assert.equal(cancels, 0, 'Sent video must not be deleted');
  await page
    .locator('input[type=file]')
    .setInputFiles({ name: 'clip.mp4', mimeType: 'video/mp4', buffer: Buffer.from('sample') });
  await page.getByRole('button', { name: '업로드', exact: true }).click();
  await page.getByText('업로드 완료. 보내기를 눌러 채팅에 올리세요.').waitFor();
  await page.getByRole('button', { name: '취소', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('.video-upload'));
  await page.waitForTimeout(100);
  assert.equal(cancels, 1, 'Canceled unsent video must be deleted');
  await page.getByRole('button', { name: '샘플.mp4 재생', exact: true }).click();
  await page.getByText('영상을 재생할 수 없습니다.').waitFor();
  assert.ok(media > 0, 'Media is requested only after play');
  assert.equal(
    await page.locator('.uploaded-video video').count(),
    0,
    'Failed playback must unload its video'
  );
  assert.deepEqual(errors, []);
  console.log(
    'PASS: headless attachment upload/send/cancel, no autoplay, failed playback cleanup; no real chat requests'
  );
} finally {
  await browser?.close();
  await server.close();
}
