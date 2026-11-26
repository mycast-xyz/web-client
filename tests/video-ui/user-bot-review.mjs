import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from '@playwright/test';
const require = createRequire(import.meta.url);
const kitRequire = createRequire(require.resolve('@sveltejs/kit/package.json'));
const folder = dirname(fileURLToPath(import.meta.url));
const plugin = dirname(kitRequire.resolve('@sveltejs/vite-plugin-svelte/package.json'));
const { svelte, vitePreprocess } = await import(pathToFileURL(resolve(plugin,'src/index.js')).href);
const environment = {name:'kit-test',resolveId(id){if(id==='$app/environment')return '\0kit-test';},
  load(id){if(id==='\0kit-test')return 'export const browser=true;export const dev=true;export const building=false;export const version="test";';}};
const server=await createServer({configFile:false,root:folder,plugins:[environment,svelte({configFile:false,preprocess:vitePreprocess()})],
  server:{host:'127.0.0.1',port:0,fs:{allow:[resolve(folder,'../..')]}}});
let browser;
try{
  await server.listen();browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:800,height:760}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async value=>{window.fixtureCopy=value;}}}));
  page.on('dialog',dialog=>dialog.accept());
  let token='mub_'+'a'.repeat(43),reveals=0;
  const id='11111111-1111-4111-8111-111111111111';
  let bots=[{id,name:'알림봇',icon:'',tokenActive:true}];
  await page.route('https://mycast.xyz:9011/user-bots**',async route=>{
    const request=route.request();
    const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Authorization,Content-Type','Access-Control-Allow-Methods':'GET,POST,PATCH,PUT,DELETE,OPTIONS'};
    if(request.method()==='OPTIONS')return route.fulfill({status:204,headers});
    assert.equal(request.headers().authorization,'Bearer fixture-owner');
    let status=200,data;
    if(request.url().endsWith('/token')){
      if(request.method()==='PUT')token='mub_'+'b'.repeat(43);
      if(request.method()==='GET')reveals++;
      if(request.method()==='DELETE'){bots[0].tokenActive=false;status=204;}
      else data={token};
    } else if(request.method()==='GET')data=bots;
    else if(request.method()==='PATCH'){Object.assign(bots[0],request.postDataJSON());status=204;}
    else if(request.method()==='POST'){bots.push({id:'22222222-2222-4222-8222-222222222222',...request.postDataJSON(),tokenActive:true});status=201;data=bots.at(-1);}
    else if(request.method()==='DELETE'){bots=bots.filter(bot=>!request.url().endsWith('/'+bot.id));status=204;}
    return route.fulfill({status,headers,contentType:'application/json',body:status===204?'':JSON.stringify(data)});
  });
  await page.goto('http://127.0.0.1:'+server.httpServer.address().port+'/user-bot.html');
  await page.getByRole('button',{name:'토큰 조회',exact:true}).waitFor();
  await page.getByRole('button',{name:'토큰 조회',exact:true}).click();
  await page.locator('input[readonly]').waitFor();
  assert.equal(await page.locator('input[readonly]').inputValue(),token);
  assert.equal(await page.locator('input[readonly]').getAttribute('type'),'password');
  await page.getByRole('button',{name:'복사',exact:true}).click();
  assert.equal(await page.evaluate(()=>window.fixtureCopy),token);
  await page.getByRole('button',{name:'내 봇 닫기',exact:true}).click();
  await page.getByRole('button',{name:'내 봇 관리 열기',exact:true}).click();
  await page.getByRole('button',{name:'토큰 조회',exact:true}).click();
  await page.locator('input[readonly]').waitFor();
  assert.equal(await page.locator('input[readonly]').inputValue(),token);assert.equal(reveals,2);
  assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage,...sessionStorage}).includes('mub_')),false);
  await page.getByRole('button',{name:'토큰 재발급',exact:true}).click();
  await page.waitForFunction(expected=>document.querySelector('input[readonly]')?.value===expected,'mub_'+'b'.repeat(43));
  await page.screenshot({path:'../user-bot-web-settings.png'});
  await page.getByRole('button',{name:'토큰 폐기',exact:true}).click();
  await page.waitForFunction(()=>!document.querySelector('input[readonly]'));
  assert.equal(await page.getByRole('button',{name:'토큰 조회',exact:true}).isDisabled(),true);
  await page.getByRole('button',{name:'내 봇 닫기',exact:true}).click();
  await page.evaluate(()=>document.fonts.ready);
  const chat=page.locator('.chat-entry');
  assert.ok((await chat.innerText()).includes('소유자: 테스트 소유자'));
  assert.equal(await chat.locator('.fa-bug').count(),1);
  assert.equal((await chat.innerText()).includes('USER BOT'),false);
  await chat.screenshot({path:'../user-bot-web-chat.png'});
  assert.deepEqual(errors,[]);
  console.log('PASS: real user-bot UI: token retrieve/reopen/copy/rotate/revoke; no local token persistence; bot icon + owner, no USER BOT label.');
}finally{await browser?.close();await server.close();}
